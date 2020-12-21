<?php

namespace App\Library;

class ValidatorsClass
{

    public function isCnpj($cnpj)
    {
        try {
            $j = 0;
            $num = [];
            for ($i = 0; $i < (strlen($cnpj)); $i++) {
                if (is_numeric($cnpj[$i])) {
                    $num[$j] = $cnpj[$i];
                    $j++;
                }
            }
            if (count($num) != 14) {
                $isCnpjValid = false;
            }
            if ($num[0] == 0 && $num[1] == 0 && $num[2] == 0 && $num[3] == 0 && $num[4] == 0 && $num[5] == 0 && $num[6] == 0 && $num[7] == 0 && $num[8] == 0 && $num[9] == 0 && $num[10] == 0 && $num[11] == 0) {
                $isCnpjValid = false;
            } else {
                $j = 5;
                for ($i = 0; $i < 4; $i++) {
                    $multiplica[$i] = $num[$i] * $j;
                    $j--;
                }
                $soma = array_sum($multiplica);
                $j = 9;
                for ($i = 4; $i < 12; $i++) {
                    $multiplica[$i] = $num[$i] * $j;
                    $j--;
                }
                $soma = array_sum($multiplica);
                $resto = $soma % 11;
                if ($resto < 2) {
                    $dg = 0;
                } else {
                    $dg = 11 - $resto;
                }
                if ($dg != $num[12]) {
                    $isCnpjValid = false;
                }
            }
            if (!isset($isCnpjValid)) {
                $j = 6;
                for ($i = 0; $i < 5; $i++) {
                    $multiplica[$i] = $num[$i] * $j;
                    $j--;
                }
                $soma = array_sum($multiplica);
                $j = 9;
                for ($i = 5; $i < 13; $i++) {
                    $multiplica[$i] = $num[$i] * $j;
                    $j--;
                }
                $soma = array_sum($multiplica);
                $resto = $soma % 11;
                if ($resto < 2) {
                    $dg = 0;
                } else {
                    $dg = 11 - $resto;
                }
                if ($dg != $num[13]) {
                    $isCnpjValid = false;
                } else {
                    $isCnpjValid = true;
                }
            }

            return $isCnpjValid;
        } catch (\Exception $e) {
            return false;
        }
    }
}
