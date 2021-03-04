<?php

namespace App\Library;

class ExportClass
{
    /**
     * @author Maou Yami (maou@yamitec.com)
     * @param array $columnNames
     * @param array $rows
     * @param string $fileName
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public static function getCsv($columnNames, $rows, $fileName = 'report.csv')
    {
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=" . $fileName,
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];
        $callback = function () use ($columnNames, $rows) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columnNames, ";");
            foreach ($rows as $row) {
                fputcsv($file, $row, ";");
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }
}
