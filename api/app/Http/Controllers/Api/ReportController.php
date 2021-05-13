<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountManager;
use Illuminate\Http\Request;
use App\Models\Provider;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ReportController extends Controller {
    private $publicStorege = 'reports/';
    private $provider;
    private $providersList;
    private $accountManager;
    private $accountManagerList;

    public function __construct()
    {
        $this->provider = new Provider();
        $this->providersList = new Provider();

        $this->accountManager = new AccountManager();
        $this->accountManagerList = new AccountManager();
    }
    
    public function index()
    {
        return view('report.index');
    }

    public function reportProviders(Request $request) 
    {
        //$this->providersList = $this->provider;

        if (empty($request->all())) {
            $this->providersList = $this->provider->all();
        }

        $this->provider = $this->provider->newQuery();

        if ($request->has('from')) {
            if ($request->has('to')) {
                $this->provider->where('created_at', '>=', $request->input('from').' 00:00:00')->where('created_at', '<=', $request->input('to').' 23:59:59');
            } else {
                $this->provider->where('created_at', '>=', $request->input('from').' 00:00:00')->where('created_at', '<=', $request->input('from').' 23:59:59');;
            }

            if ($request->has('cnpj')) {
                $this->provider->where('cnpj', $request->input('cnpj'));
            }

            if ($request->has('company_name')) {
                $this->provider->where('company_name', $request->input('company_name'));
            }

            $this->providersList = $this->provider->get();
        } else {
            if ($request->has('cnpj')) {
                $this->provider->where('cnpj', $request->input('cnpj'));
            }
    
            if ($request->has('company_name')) {
                $this->provider->where('company_name', $request->input('company_name'));
            }

            $this->providersList = $this->provider->get();
        }

        try 
        {

            if (!$this->providersList->isEmpty()) 
            {
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();
                
                $sheet->setTitle(__('Relatório de Fornecedores'));

                $sheet->getStyle('A1:B1')->getBorders()->getAllBorders()->setBorderStyle(true);
                $sheet->getStyle('A1:B1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
                $sheet->getStyle('A1:B1')->getFont()->setBold(true);
                $sheet->getStyle('A1:B1')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

                $sheet->getStyle('A2:B2')->getBorders()->getAllBorders()->setBorderStyle(true);
                $sheet->getStyle('A2:B2')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
                $sheet->getStyle('A2:B2')->getFont()->setBold(true);
                $sheet->getStyle('A2:B2')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

                $sheet->getStyle('A3:B3')->getBorders()->getAllBorders()->setBorderStyle(true);
                $sheet->getStyle('A3:B3')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
                $sheet->getStyle('A3:B3')->getFont()->setBold(true);
                $sheet->getStyle('A3:B3')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

                $sheet->getStyle('A5:AB5')->getBorders()->getAllBorders()->setBorderStyle(true);
                $sheet->getStyle('A5:AB5')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
                $sheet->getStyle('A5:AB5')->getFont()->setBold(true);
                $sheet->getStyle('A5:AB5')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

                $sheet->getColumnDimension('A')->setAutoSize(true);
                $sheet->getColumnDimension('B')->setAutoSize(true);
                $sheet->getColumnDimension('C')->setAutoSize(true);
                $sheet->getColumnDimension('D')->setAutoSize(true);
                $sheet->getColumnDimension('E')->setAutoSize(true);
                $sheet->getColumnDimension('F')->setAutoSize(true);
                $sheet->getColumnDimension('G')->setAutoSize(true);
                $sheet->getColumnDimension('H')->setAutoSize(true);
                $sheet->getColumnDimension('I')->setAutoSize(true);
                $sheet->getColumnDimension('J')->setAutoSize(true);
                $sheet->getColumnDimension('K')->setAutoSize(true);
                $sheet->getColumnDimension('L')->setAutoSize(true);
                $sheet->getColumnDimension('M')->setAutoSize(true);
                $sheet->getColumnDimension('N')->setAutoSize(true);
                $sheet->getColumnDimension('O')->setAutoSize(true);
                $sheet->getColumnDimension('P')->setAutoSize(true);
                $sheet->getColumnDimension('Q')->setAutoSize(true);
                $sheet->getColumnDimension('R')->setAutoSize(true);
                $sheet->getColumnDimension('S')->setAutoSize(true);
                $sheet->getColumnDimension('T')->setAutoSize(true);
                $sheet->getColumnDimension('U')->setAutoSize(true);
                $sheet->getColumnDimension('V')->setAutoSize(true);
                $sheet->getColumnDimension('W')->setAutoSize(true);
                $sheet->getColumnDimension('X')->setAutoSize(true);
                $sheet->getColumnDimension('Y')->setAutoSize(true);
                $sheet->getColumnDimension('Z')->setAutoSize(true);
                $sheet->getColumnDimension('AA')->setAutoSize(true);
                $sheet->getColumnDimension('AB')->setAutoSize(true);

                $sheet->setCellValue('A1', __('Qtd Total'));
                $sheet->setCellValue('A2', __('Qtd Ativas'));
                $sheet->setCellValue('A3', __('Qtd inativas'));

                $sheet->setCellValue('A5', __('Situação'));
                $sheet->setCellValue('B5', __('Fornecedor'));
                $sheet->setCellValue('C5', __('Tipo'));
                $sheet->setCellValue('D5', __('CNPJ'));
                $sheet->setCellValue('E5', __('Razão Social'));
                $sheet->setCellValue('F5', __('Nome Fantasia'));
                $sheet->setCellValue('G5', __('Qtd Clientes Compradores'));
                $sheet->setCellValue('H5', __('Data de adesão'));
                $sheet->setCellValue('I5', __('Data de finalização'));
                $sheet->setCellValue('J5', __('Taxa de adesão'));
                $sheet->setCellValue('K5', __('Vendedor'));
                $sheet->setCellValue('L5', __('CEP'));
                $sheet->setCellValue('M5', __('Endereço'));
                $sheet->setCellValue('N5', __('Complemento'));
                $sheet->setCellValue('O5', __('Contato 01'));
                $sheet->setCellValue('P5', __('Contato 02'));
                $sheet->setCellValue('Q5', __('E-mail'));
                $sheet->setCellValue('R5', __('Site'));
                $sheet->setCellValue('S5', __('LinkedIn'));
                $sheet->setCellValue('T5', __('Facebook'));
                $sheet->setCellValue('U5', __('Instagram'));
                $sheet->setCellValue('V5', __('Nome Resp'));
                $sheet->setCellValue('W5', __('Telefone Resp'));
                $sheet->setCellValue('X5', __('E-mail Resp'));
                $sheet->setCellValue('Y5', __('Função Resp'));
                $sheet->setCellValue('Z5', __('Data de cadastro'));
                $sheet->setCellValue('AA5', __('Última alteração'));
                $sheet->setCellValue('AB5', __('Cadastrante'));

                $qtyTotal = count($this->providersList); 
                $qttyActive = count($this->providersList->where('active', 1));
                $qttyDesactive = count($this->providersList->where('active', 0));

                $sheet->setCellValueByColumnAndRow(2, 1, $qtyTotal);
                $sheet->setCellValueByColumnAndRow(2, 2, $qttyActive);
                $sheet->setCellValueByColumnAndRow(2, 3, $qttyDesactive);

                $line = 6;

                foreach ($this->providersList as $key => $provider) {

                    $type = ($provider->type == 1) ? 'Matriz' : 'Filial';
                    $active = ($provider->active == 1) ? 'Ativo' : 'Desativado';
                    $created_at = date('d/m/Y', strtotime($provider->created_at));
                    $updated_at = date('d/m/Y', strtotime($provider->updated_at));
                    $accession_date = date('d/m/Y', strtotime($provider->contracts[0]->accession_date));
                    $end_date = date('d/m/Y', strtotime($provider->contracts[0]->end_date));
                    $rate = number_format($provider->contracts[0]->rate, 2, ',', '.');
                    $additional = ($provider->addresses->additional != 'null') ? $provider->addresses->additional : '';
                    $phone2 = ($provider->contacts->phone2 != 'null') ? $provider->contacts->phone2 : '';
                    $site = ($provider->contacts->site != 'null') ? $provider->contacts->site : '';
                    $linkedin = ($provider->contacts->linkedin != 'null') ? $provider->contacts->linkedin : '';
                    $linkedin = ($provider->contacts->linkedin != 'null') ? $provider->contacts->linkedin : '';
                    $facebook = ($provider->contacts->facebook != 'null') ? $provider->contacts->facebook : '';
                    $instagram = ($provider->contacts->instagram != 'null') ? $provider->contacts->instagram : '';

                    $sheet->setCellValueByColumnAndRow(1, $line, $active);
                    $sheet->setCellValueByColumnAndRow(2, $line, $provider->providertype->name);
                    $sheet->setCellValueByColumnAndRow(3, $line, $type);
                    $sheet->setCellValueByColumnAndRow(4, $line, "{$provider->cnpj} ");
                    $sheet->setCellValueByColumnAndRow(5, $line, $provider->company_name);
                    $sheet->setCellValueByColumnAndRow(6, $line, $provider->fantasy_name);
                    $sheet->setCellValueByColumnAndRow(7, $line, ' ');
                    $sheet->setCellValueByColumnAndRow(8, $line, $accession_date);
                    $sheet->setCellValueByColumnAndRow(9, $line, $end_date);
                    $sheet->setCellValueByColumnAndRow(10, $line, $rate);
                    $sheet->setCellValueByColumnAndRow(11, $line, $provider->contracts[0]->contributors->name);
                    $sheet->setCellValueByColumnAndRow(12, $line, $provider->addresses->zipcode);
                    $sheet->setCellValueByColumnAndRow(13, $line, $provider->addresses->street);
                    $sheet->setCellValueByColumnAndRow(14, $line, $additional);
                    $sheet->setCellValueByColumnAndRow(15, $line, $provider->contacts->phone1);
                    $sheet->setCellValueByColumnAndRow(16, $line, $phone2);
                    $sheet->setCellValueByColumnAndRow(17, $line, $provider->contacts->email);
                    $sheet->setCellValueByColumnAndRow(18, $line, $site);
                    $sheet->setCellValueByColumnAndRow(19, $line, $linkedin);
                    $sheet->setCellValueByColumnAndRow(20, $line, $facebook);
                    $sheet->setCellValueByColumnAndRow(21, $line, $instagram);
                    $sheet->setCellValueByColumnAndRow(22, $line, $provider->managers[0]->name);
                    $sheet->setCellValueByColumnAndRow(23, $line, $provider->managers[0]->contacts->phone1);
                    $sheet->setCellValueByColumnAndRow(24, $line, $provider->managers[0]->contacts->email);
                    $sheet->setCellValueByColumnAndRow(25, $line, $provider->managers[0]->function);
                    $sheet->setCellValueByColumnAndRow(26, $line, $created_at);
                    $sheet->setCellValueByColumnAndRow(27, $line, $updated_at);
                    $sheet->setCellValueByColumnAndRow(28, $line, ' ');

                    $line++;
                }

                $writer = new Xlsx($spreadsheet);
                $filename = "report-" . time() . ".xlsx";
                Storage::disk('local')->makeDirectory('reports');
                $writer->save(storage_path('app/reports/'.$filename));

                return Storage::download($this->publicStorege.$filename);
            }

            return response()->json(["success"=> false, "type" => "error", "message" => "Nenhum fornecedor encontrado."]);

        } catch(\Exception $error) {
            //echo $error->getTraceAsString();
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao gerar o relatório", "error" => $error->getMessage()], 201);
        }
    }


    public function reportSales(Request $request) 
    {
        //echo "<pre>"; dd($accManager[0]->contributor->name);die;
        if ($request->filled('from')) {
            if (!$request->filled('to')) {
                $request->merge([
                    'to' => $request->from
                ]);
            }

            $this->accountManagerList = $this->accountManager->whereBetween('created_at', [$request->from.' 00:00:00', $request->to.' 23:59:59'])->get();
        }else{
            $this->accountManagerList = $this->accountManager->get();
        }

        try 
        {

            if (!$this->accountManagerList->isEmpty()) 
            {
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();
                
                $sheet->setTitle(__('Relatório de Vendas'));

                $sheet->getStyle('A1:B1')->getBorders()->getAllBorders()->setBorderStyle(true);
                $sheet->getStyle('A1:B1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
                $sheet->getStyle('A1:B1')->getFont()->setBold(true);
                $sheet->getStyle('A1:B1')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

                $sheet->getStyle('A2:B2')->getBorders()->getAllBorders()->setBorderStyle(true);
                $sheet->getStyle('A2:B2')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
                $sheet->getStyle('A2:B2')->getFont()->setBold(true);
                $sheet->getStyle('A2:B2')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

                $sheet->getStyle('A3:B3')->getBorders()->getAllBorders()->setBorderStyle(true);
                $sheet->getStyle('A3:B3')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
                $sheet->getStyle('A3:B3')->getFont()->setBold(true);
                $sheet->getStyle('A3:B3')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

                $sheet->getStyle('A5:N5')->getBorders()->getAllBorders()->setBorderStyle(true);
                $sheet->getStyle('A5:N5')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
                $sheet->getStyle('A5:N5')->getFont()->setBold(true);
                $sheet->getStyle('A5:N5')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

                $sheet->getColumnDimension('A')->setAutoSize(true);
                $sheet->getColumnDimension('B')->setAutoSize(true);
                $sheet->getColumnDimension('C')->setAutoSize(true);
                $sheet->getColumnDimension('D')->setAutoSize(true);
                $sheet->getColumnDimension('E')->setAutoSize(true);
                $sheet->getColumnDimension('F')->setAutoSize(true);
                $sheet->getColumnDimension('G')->setAutoSize(true);
                $sheet->getColumnDimension('H')->setAutoSize(true);
                $sheet->getColumnDimension('I')->setAutoSize(true);
                $sheet->getColumnDimension('J')->setAutoSize(true);
                $sheet->getColumnDimension('K')->setAutoSize(true);
                $sheet->getColumnDimension('L')->setAutoSize(true);
                $sheet->getColumnDimension('M')->setAutoSize(true);
                $sheet->getColumnDimension('N')->setAutoSize(true);

                $sheet->setCellValue('A1', __('Qtd Total'));
                $sheet->setCellValue('A2', __('Qtd Ativas'));
                $sheet->setCellValue('A3', __('Qtd inativas'));

                $sheet->setCellValue('A5', __('Colaborador'));
                $sheet->setCellValue('B5', __('Tipo de Colaborador'));
                $sheet->setCellValue('C5', __('Cidade'));
                $sheet->setCellValue('D5', __('Situação'));
                $sheet->setCellValue('E5', __('CNPJ'));
                $sheet->setCellValue('F5', __('Razão Social'));
                $sheet->setCellValue('G5', __('Nome Fantasia'));
                $sheet->setCellValue('H5', __('Data de adesão'));
                $sheet->setCellValue('I5', __('Data de finalização'));
                $sheet->setCellValue('J5', __('Taxa de adesão'));
                $sheet->setCellValue('K5', __('Nome Resp'));
                $sheet->setCellValue('L5', __('Telefone Resp'));
                $sheet->setCellValue('M5', __('E-mail Resp'));
                $sheet->setCellValue('N5', __('Função Resp'));

                $qtyTotal = count($this->accountManagerList); 
                $qttyActive = count($this->accountManagerList->where('active', 1));
                $qttyDesactive = count($this->accountManagerList->where('active', 0));

                $sheet->setCellValueByColumnAndRow(2, 1, $qtyTotal);
                $sheet->setCellValueByColumnAndRow(2, 2, $qttyActive);
                $sheet->setCellValueByColumnAndRow(2, 3, $qttyDesactive);

                $line = 6;

                foreach ($this->accountManagerList as $key => $accountManager) {
                    dd($accountManager->contributor);

                    /*$type = ($provider->type == 1) ? 'Matriz' : 'Filial';
                    $active = ($provider->active == 1) ? 'Ativo' : 'Desativado';
                    $created_at = date('d/m/Y', strtotime($provider->created_at));
                    $updated_at = date('d/m/Y', strtotime($provider->updated_at));
                    $accession_date = date('d/m/Y', strtotime($provider->contracts[0]->accession_date));
                    $end_date = date('d/m/Y', strtotime($provider->contracts[0]->end_date));
                    $rate = number_format($provider->contracts[0]->rate, 2, ',', '.');
                    $additional = ($provider->addresses->additional != 'null') ? $provider->addresses->additional : '';
                    $phone2 = ($provider->contacts->phone2 != 'null') ? $provider->contacts->phone2 : '';
                    $site = ($provider->contacts->site != 'null') ? $provider->contacts->site : '';
                    $linkedin = ($provider->contacts->linkedin != 'null') ? $provider->contacts->linkedin : '';
                    $linkedin = ($provider->contacts->linkedin != 'null') ? $provider->contacts->linkedin : '';
                    $facebook = ($provider->contacts->facebook != 'null') ? $provider->contacts->facebook : '';
                    $instagram = ($provider->contacts->instagram != 'null') ? $provider->contacts->instagram : '';*/

                    $active = ($accountManager->contributor->active == 1) ? 'Ativo' : 'Desativado';


                    $sheet->setCellValueByColumnAndRow(1, $line, $accountManager->contributor->name);
                    $sheet->setCellValueByColumnAndRow(2, $line, $accountManager->contributor->function);
                    $sheet->setCellValueByColumnAndRow(3, $line, $accountManager->contributor->addresses->city);
                    $sheet->setCellValueByColumnAndRow(4, $line, $active);
                    $sheet->setCellValueByColumnAndRow(5, $line, "{$accountManager->provider->cnpj} ");/*
                    $sheet->setCellValueByColumnAndRow(6, $line, $provider->fantasy_name);
                    $sheet->setCellValueByColumnAndRow(7, $line, ' ');
                    $sheet->setCellValueByColumnAndRow(8, $line, $accession_date);
                    $sheet->setCellValueByColumnAndRow(9, $line, $end_date);
                    $sheet->setCellValueByColumnAndRow(10, $line, $rate);
                    $sheet->setCellValueByColumnAndRow(11, $line, $provider->contracts[0]->contributors->name);
                    $sheet->setCellValueByColumnAndRow(12, $line, $provider->addresses->zipcode);
                    $sheet->setCellValueByColumnAndRow(13, $line, $provider->addresses->street);
                    $sheet->setCellValueByColumnAndRow(14, $line, $additional);*/

                    $line++;
                }

                $writer = new Xlsx($spreadsheet);
                $filename = "vendas-" . time() . ".xlsx";
                Storage::disk('local')->makeDirectory('reports');
                $writer->save(storage_path('app/reports/'.$filename));

                return Storage::download($this->publicStorege.$filename);
            }

            return response()->json(["success"=> false, "type" => "error", "message" => "Nenhum venda encontrada."]);

        } catch(\Exception $error) {
            echo $error->getTraceAsString();
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao gerar o relatório", "error" => $error->getMessage()], 201);
        }
    }


    public function clientRank(Request $request){
        $return = \App\Models\Client::with(['account_managers'])
            ->get()->map(function($item) {
                if(count($item->account_managers) > 0){
                    $accs = $item->account_managers->map(function($acc){
                        $acc->amount = $acc->bill_type == 2 ? -$acc->amount : $acc->amount;
                        return $acc;
                    });
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'amount' => array_sum(array_column($accs->toArray(), 'amount')),
                        'type' => "Plataforma",
                    ];
                }
            });
        return response()->json(array_filter($return->toArray()));
    }
    public function providerRank(Request $request){
        $return = \App\Models\Provider::with(['account_managers', 'providertype'])
        ->get()->map(function($item) {
            if(count($item->account_managers) > 0){
                $accs = $item->account_managers->map(function($acc){
                    $acc->amount = $acc->bill_type == 2 ? -$acc->amount : $acc->amount;
                    return $acc;
                });
                return [
                    'id' => $item->id,
                    'fantasy_name' => $item->fantasy_name,
                    'company_name' => $item->company_name,
                    'amount' => array_sum(array_column($accs->toArray(), 'amount')),
                    'type' => $item->providertype->name,
                    'bill_type' => $item->bill_type == 2 ? "Despesa" : "Receita",
                ];
            }
        });
    return response()->json(array_filter($return->toArray()));
    }

    public function reportClientRank(Request $request){

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        $sheet->setTitle(__('Ranking de Clientes'));

        $sheet->getStyle('A1:C1')->getBorders()->getAllBorders()->setBorderStyle(true);
        $sheet->getStyle('A1:C1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
        $sheet->getStyle('A1:C1')->getFont()->setBold(true);
        $sheet->getStyle('A1:C1')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);
        
        $sheet->setCellValue('A1', __('Nome'));
        $sheet->setCellValue('B1', __('Tipo'));
        $sheet->setCellValue('C1', __('Movimento'));

        $line = 2;
        $rank = \App\Models\Client::with(['account_managers_detached', 'account_managers_nodetached']);
        if(isset($request->from) && $request->from != ""){
            if(!isset($request->to) || $request->to == ""){
                $request->merge([
                    'to' => $request->from
                ]);
            }
            $account_manager = \App\Models\AccountManager::with('clients')->whereBetween('launch_date', [$request->from." 00:00:00", $request->to." 23:59:59"])->get();
            if($account_manager->pluck('clients')->count() > 0 ){
                $rank = $rank->whereIn('id', $account_manager->pluck('clients')[0]->pluck('id')->toArray());
            }else{
                return response()->json(['success'=> false, 'message' => 'Não há registros cadastrados neste intervalo']);
            }
        }
        
        
        $rank = $rank->get()->map(function($item) {
                $data = [];
                if(count($item->account_managers_detached) > 0){
                    $accs = $item->account_managers_detached->map(function($acc){
                        $acc->amount = $acc->bill_type == 2 ? -$acc->amount : $acc->amount;
                        return $acc;
                    });
                    $data[] = [
                        'id' => $item->id,
                        'name' => $item->name,
                        'amount' => array_sum(array_column($accs->toArray(), 'amount')),
                        'type' => "Farmácia",
                    ];
                }
                if(count($item->account_managers_nodetached) > 0){
                    $accs = $item->account_managers_nodetached->map(function($acc){
                        $acc->amount = $acc->bill_type == 2 ? -$acc->amount : $acc->amount;
                        return $acc;
                    });
                    $data[] = [
                        'id' => $item->id,
                        'name' => $item->name,
                        'amount' => array_sum(array_column($accs->toArray(), 'amount')),
                        'type' => "Plataforma",
                    ];
                }
                return $data;
            });
            $rank = array_filter($rank->toArray())[0];
            //return response()->json($rank);
            foreach($rank as $k => $ranking){
                $sheet->setCellValueByColumnAndRow(1, $line, $ranking['name']);
                $sheet->setCellValueByColumnAndRow(2, $line, $ranking['type']);
                $sheet->setCellValueByColumnAndRow(3, $line, number_format($ranking['amount'],2,',','.'));
                
                $line++;
            }

        $writer = new Xlsx($spreadsheet);
        $filename = "ranking-cliente-" . time() . ".xlsx";
        Storage::disk('local')->makeDirectory('reports');
        $writer->save(storage_path('app/reports/'.$filename));

        return Storage::download($this->publicStorege.$filename);
    }

    public function reportProviderRank(Request $request){

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        $sheet->setTitle(__('Ranking de Fornecedores'));

        $sheet->getStyle('A1:C1')->getBorders()->getAllBorders()->setBorderStyle(true);
        $sheet->getStyle('A1:C1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('e2efd9');
        $sheet->getStyle('A1:C1')->getFont()->setBold(true);
        $sheet->getStyle('A1:C1')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);
        
        $sheet->setCellValue('A1', __('Fornecedor'));
        $sheet->setCellValue('B1', __('Tipo'));
        $sheet->setCellValue('C1', __('Movimento'));

        $line = 2;

        $rank = \App\Models\Provider::with(['account_managers_detached', 'account_managers_nodetached','providertype']);
        if(isset($request->from) && $request->from != ""){
            if(!isset($request->to) || $request->to == ""){
                $request->merge([
                    'to' => $request->from
                ]);
            }
            $account_manager = \App\Models\AccountManager::with('clients')->whereBetween('launch_date', [$request->from." 00:00:00", $request->to." 23:59:59"])->get();
            if($account_manager->pluck('providers')->count() > 0 ){
                $rank = $rank->whereIn('id', $account_manager->pluck('providers')[0]->pluck('id')->toArray());
            }else{
                return response()->json(['success'=> false, 'message' => 'Não há registros cadastrados neste intervalo']);
            }
        }
        $rank = $rank->get()->map(function($item) {
            $data = [];
            if(count($item->account_managers_detached) > 0){
                $accs = $item->account_managers_detached->map(function($acc){
                    $acc->amount = $acc->bill_type == 2 ? -$acc->amount : $acc->amount;
                    return $acc;
                });
                $data[] = [
                    'id' => $item->id,
                    'fantasy_name' => $item->fantasy_name,
                    'company_name' => $item->company_name,
                    'amount' => array_sum(array_column($accs->toArray(), 'amount')),
                    'type' => "Farmácia",
                    'bill_type' => $item->bill_type == 2 ? "Despesa" : "Receita",
                ];
            }
            if(count($item->account_managers_nodetached) > 0){
                $accs = $item->account_managers_nodetached->map(function($acc){
                    $acc->amount = $acc->bill_type == 2 ? -$acc->amount : $acc->amount;
                    return $acc;
                });
                $data[] = [
                    'id' => $item->id,
                    'fantasy_name' => $item->fantasy_name,
                    'company_name' => $item->company_name,
                    'amount' => array_sum(array_column($accs->toArray(), 'amount')),
                    'type' => "Plataforma",
                    'bill_type' => $item->bill_type == 2 ? "Despesa" : "Receita",
                ];
            }
            return $data;
        });
        $rank = array_filter($rank->toArray())[0];
        foreach($rank as $k => $ranking){
            $sheet->setCellValueByColumnAndRow(1, $line, $ranking['fantasy_name']);
            $sheet->setCellValueByColumnAndRow(2, $line, $ranking['type']);
            $sheet->setCellValueByColumnAndRow(3, $line, number_format($ranking['amount'], 2,',','.'));
            
            $line++;
        }

        $writer = new Xlsx($spreadsheet);
        $filename = "ranking-fornecedor-" . time() . ".xlsx";
        Storage::disk('local')->makeDirectory('reports');
        $writer->save(storage_path('app/reports/'.$filename));

        return Storage::download($this->publicStorege.$filename);
    }
}