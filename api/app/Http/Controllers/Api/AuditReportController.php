<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Audit;
use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class AuditReportController extends Controller {
    private $publicStorege = 'audits/';
    private $audit;
    private $auditList;
    private $user;

    public function __construct()
    {
        $this->audit = Audit::with(['user']);
    }
    
    public function reportAudit(Request $request) 
    {
        try 
        {
            if ($request->has('from') && $request->has('from') != "") {
                if(!$request->has('to') && $request->has('to') == "")
                    $request->merge([
                        'to'=> $request->from
                    ]);

                    $this->audit->whereBetween('created_at', [$request->from." 00:00:00", $request->to." 23:59:59"]);
            }

            if($request->has('name') && $request->has('name') != "") {
                $this->user = User::where('name', 'like',"%{$request->name}%")->get();
                $this->audit = $this->audit->whereIn('user_id', $this->user->pluck('id'));
            }

            if(isset($request->email) && $request->email != "") {
                $this->user = User::where('email', 'like',"%{$request->email}%")->get();
                $this->audit = $this->audit->whereIn('user_id', $this->user->pluck('id'));
            }
            
            $this->auditList = $this->audit->get()->map(function($item) 
            {
                return [
                    'id' => $item->id,
                    'date' => date('d/m/Y h:i:s', strtotime($item->created_at)),
                    'name' => iconv("UTF-8", "ISO-8859-1//TRANSLIT", $item->user->name),
                    'user' => $item->user->email,
                    'justification' => iconv("UTF-8", "ISO-8859-1//TRANSLIT", $item->justification),
                    'from' => implode(', ', array_map(
                        function ($v, $k) use($item){ 
                            $from = json_decode($item->from, true);
                            
                            if(!is_array($v) && !is_object($v)){
                                
                                return sprintf("%s = \"%s\"", $k,iconv("UTF-8", "ISO-8859-1//TRANSLIT", $v)); 
                            }
                            
                        },
                        json_decode($item->from,true),
                        array_keys(json_decode($item->from,true))
                    )),
                    'to' => implode(', ', array_map(function ($v, $k) use($item)
                        { 
                            $from = json_decode($item->to,true);
                            
                            if(!is_array($v) && !is_object($v)){
                                
                                return sprintf("%s = \"%s\"", $k, iconv("UTF-8", "ISO-8859-1//TRANSLIT",$v)); 
                            }
                            
                        },
                        json_decode($item->to, true),
                        array_keys(json_decode($item->to, true))
                    ))
                ];
            });

            if (!$this->auditList->isEmpty()) 
            {
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();
                
                $sheet->setTitle(__('Relatório de Auditoria'));

                $sheet->getStyle('A1:G1')->getBorders()->getAllBorders()->setBorderStyle(true);
                $sheet->getStyle('A1:G1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
                $sheet->getStyle('A1:G1')->getFont()->setBold(true);
                $sheet->getStyle('A1:G1')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

                $sheet->getColumnDimension('A')->setAutoSize(true);
                $sheet->getColumnDimension('B')->setAutoSize(true);
                $sheet->getColumnDimension('C')->setAutoSize(true);
                $sheet->getColumnDimension('D')->setAutoSize(true);
                $sheet->getColumnDimension('E')->setAutoSize(true);
                $sheet->getColumnDimension('F')->setAutoSize(true);
                $sheet->getColumnDimension('G')->setAutoSize(true);
                
                $sheet->setCellValue('A1', __('ID'));
                $sheet->setCellValue('B1', __('Data'));
                $sheet->setCellValue('C1', __('Nome'));
                $sheet->setCellValue('D1', __('Usuário'));
                $sheet->setCellValue('E1', __('Justificativa'));
                $sheet->setCellValue('F1', __('De'));
                $sheet->setCellValue('G1', __('Para'));

                $line = 2;

                foreach ($this->auditList as $audit) {

                    $sheet->setCellValueByColumnAndRow(1, $line, $audit['id']);
                    $sheet->setCellValueByColumnAndRow(2, $line, $audit['date']);
                    $sheet->setCellValueByColumnAndRow(3, $line, $audit['name']);
                    $sheet->setCellValueByColumnAndRow(4, $line, $audit['user']);
                    $sheet->setCellValueByColumnAndRow(5, $line, $audit['justification']);
                    $sheet->setCellValueByColumnAndRow(6, $line, $audit['from']);
                    $sheet->setCellValueByColumnAndRow(7, $line, $audit['to']);

                    $line++;
                }

                $writer = new Xlsx($spreadsheet);
                $filename = "audit-" . time() . ".xlsx";
                Storage::disk('local')->makeDirectory('audits');
                $writer->save(storage_path('app/audits/'.$filename));

                return Storage::download($this->publicStorege.$filename);
            }

            return response('false', 203);

        } catch(\Exception $error) {
            echo $error->getTraceAsString();
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao gerar o relatório de auditoria", "error" => $error->getMessage(), "linha" => $error->getLine()], 201);
        }
    }
}