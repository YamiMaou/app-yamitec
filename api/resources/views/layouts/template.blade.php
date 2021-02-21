<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Lojas West</title>
    <link rel="shortcut icon" href="../../dist/img/lwlogo.gif" />
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="../../plugins/fontawesome-free/css/all.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <!-- overlayScrollbars -->
    <!-- SweetAlert2 -->
    <link rel="stylesheet" href="../../plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css">
    <link rel="stylesheet" href="../../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="../../plugins/datatables-responsive/css/responsive.bootstrap4.min.css">

    <link rel="stylesheet" href="../../plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="../../dist/css/adminlte.min.css">
    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">

    <link rel="stylesheet" href="../../css/style.css">
</head>

<body class="hold-transition sidebar-mini layout-fixed layout-navbar-fixed" style="font-size: 14px">
    <!-- Site wrapper -->
    <div class="wrapper">
        <!-- Navbar -->
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <!-- Left navbar links -->
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link float-right" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
            </ul>

            <!-- SEARCH FORM -->

            <!-- Right navbar links -->
            <ul class="navbar-nav ml-auto">
                <!-- Messages Dropdown Menu -->
                <form class="form-inline ml-3 d-none">
                    <div class="input-group input-group-sm">
                        <input class="form-control form-control-navbar" type="search" placeholder="Busca" aria-label="Search">
                        <div class="input-group-append">
                            <button class="btn btn-navbar" type="submit">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </form>
                <!-- Notifications Dropdown Menu -->
                <li class="nav-item ml-3">
                    <a class="btn btn-md btn-danger" href="{{route('admin.logout')}}">Sair</a>
                </li>
            </ul>
        </nav>
        <!-- /.navbar -->

        <!-- Main Sidebar Container -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <!-- Brand Logo -->
            <a href="{{route('index')}}" class="brand-link">
                <img src="../../dist/img/lwlogo.gif" alt="Loja 1.0" class="brand-image img-circle elevation-3" style="opacity: .8">
                <span class="brand-text font-weight-light">Loja 1.0</span>
            </a>

            <!-- Sidebar -->
            <div class="sidebar">
                <!-- Sidebar user (optional) -->
                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div class="image">
                        <img src="{{Auth::user()->employee()->image ?? '../../dist/img/lwlogo.gif'}}" style="min-height:36px!important" class="img-circle elevation-2" alt="User Image">
                    </div>
                    <div class="info">
                        <a href="#" class="d-block">{{ Auth::user()->employee()->name ?? Auth::user()->name }} </a>
                    </div>
                </div>

                <!-- Sidebar Menu -->
                <tw class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li class="nav-item border-bottom">
                            <a href="#" class="nav-link" onclick="loadViewInHome('{{route('home')}}')">
                                <i class="nav-icon fas fa-home"></i>
                                <p>
                                    Inicio
                                </p>
                            </a>
                        </li>
                        <li class="nav-item border-bottom">
                            <a href="#" class="nav-link" onclick="loadViewInHome('{{route('lojas.index')}}')">
                                <i class="nav-icon fas fa-store-alt"></i>
                                <p>
                                    Lojas <span data-toggle="tooltip" title="{{count($globalShops)}} Lojas Cadastradas" class="badge bg-success">{{count($globalShops)}}</span>
                                </p>
                            </a>
                        </li>
                        <li class="nav-item border-bottom">
                            <a href="#" class="nav-link" onclick="loadViewInHome('{{route('customer.index')}}')">
                                <i class="nav-icon fas fa-users"></i>
                                <p>
                                    Clientes
                                </p>
                            </a>
                        </li>
                        <li class="nav-item border-bottom">
                            <a href="#" class="nav-link" onclick="loadViewInHome('{{route('funcionarios.index')}}')">
                                <i class="nav-icon fas fa-people-carry"></i>
                                <p>
                                    Funcionarios <span data-toggle="tooltip" title="{{count($globalEmployees)}} Funcionarios Cadastrados" class="badge bg-success">{{count($globalEmployees)}}</span>
                                </p>
                            </a>
                        </li>
                        <li class="nav-item border-bottom">
                            <a href="#" class="nav-link" onclick="loadViewInHome('{{route('produtos.index')}}')">
                                <i class="nav-icon fas fa-barcode"></i>
                                <p>
                                    Produtos <span data-toggle="tooltip" title="{{count($globalProducts)}} Produtos Cadastrados" class="badge bg-success">{{count($globalProducts)}}</span>
                                </p>
                            </a>
                        </li>
                        <li class="nav-item border-bottom">
                            <a href="#" class="nav-link" onclick="loadViewInHome('{{route('fornecedores.index')}}')">
                                <i class="nav-icon fas fa-truck"></i>
                                <p>
                                    Fornecedores <span data-toggle="tooltip" title="{{count($globalProviders)}} Fornecedores Cadastrados" class="badge bg-success">{{count($globalProviders)}}</span>
                                </p>
                            </a>
                        </li>
                        <li class="nav-item border-bottom">
                            <a href="#" class="nav-link">
                                <i class="nav-icon fa fa-cubes"></i>
                                <p>
                                    Estoque
                                </p>
                            </a>
                        </li>
                        <li class="nav-item border-bottom">
                            <a href="#" class="nav-link" onclick="loadViewInHome('{{route('settings.home')}}')">
                                <i class="nav-icon fas fa-cogs"></i>
                                <p>
                                    Configurações
                                </p>
                            </a>
                        </li>
                    </ul>
                    </nav>
                    <!-- /.sidebar-menu -->
            </div>
            <!-- /.sidebar -->
        </aside>

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <div style="height: 100vh" class="d-none" id="spinner">
                <div class="d-flex justify-content-center align-items-center  h-100">
                    <div class="text-center">
                        <img src="../../dist/img/lwlogo.gif" style="width: 15rem; height: 15rem;" alt="Loja 1.0" class="brand-image img-circle elevation-8" style="opacity: .8">
                    </div>
                    <div class="text-center d-none">
                        <div class="spinner-border" style="width: 5rem; height: 5rem;" role="status">
                            <span class="sr-only">Carregando...</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="home_menu_container" class="py-2">
                @section('body')
                @include('home.index')
                @stop
                @yield('body')
            </div>

        </div>
        <!-- /.content-wrapper -->

        <footer class="main-footer">
            <div class="float-right d-none d-sm-block">

            </div>
            <strong>Software Management <a href="#">West </a>.</strong> All rights
            reserved.
        </footer>

        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
        </aside>
        <!-- /.control-sidebar -->
    </div>
    <!-- ./wrapper -->

    <!-- jQuery -->
    <script src="../../plugins/jquery/jquery.min.js"></script>
    <!--jQuery UI 1.11.4 -->
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

    <!-- INPUT MASK -->
    <script src="../../plugins/inputmask/min/jquery.inputmask.bundle.min.js"></script>
    <!-- Bootstrap 4 -->
    <script src="../../plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <!-- overlayScrollbars -->

    <script src="../../plugins/datatables/jquery.dataTables.min.js"></script>
    <script src="../../plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
    <script src="../../plugins/datatables/pt-translate.js"></script>

    <script src="../../plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
    <!-- AdminLTE App -->
    <script src="../../plugins/sweetalert2/sweetalert2.min.js"></script>

    <script src="../../dist/js/adminlte.min.js"></script>
    <!-- AdminLTE for demo purposes -->
    <script src="../../dist/js/demo.js"></script>

    <script src="{{asset('js/app.js')}}"></script>
    <script src="{{asset('js/ajaxRequests.js')}}"></script>
    <script src="{{asset('js/commonmethods.js')}}"></script>

    <script>
        $(function() {
            $("#example1").DataTable({
                "responsive": true,
                "autoWidth": false
            });
        });
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    </script>
    <script>
        function defaultMasks() {
            $("input[data-money]").inputmask('decimal', {
                'alias': 'numeric',
                'removeMaskOnSubmit': true,
                'groupSeparator': '.',
                'autoGroup': true,
                'digits': 2,
                'radixPoint': ",",
                'digitsOptional': false,
                'allowMinus': false,
                'prefix': 'R$ ',
                'placeholder': ''
            });

            $("input[name^='rg']").inputmask({
                mask: ["99.999.999-9", "99.999.999-*"],
                keepStatic: true
            });

            $("input[name^='cpf']").inputmask({
                mask: ['999.999.999-99'],
                keepStatic: true
            });
            $("input[name^='cnpj']").inputmask({
                mask: ['99.999.999/9999-99'],
                keepStatic: true
            });

            $("input[name='documento']").inputmask({
                mask: ["99.999.999-9", "99.999.999-*", '999.999.999-99', '99.999.999/9999-99'],
                keepStatic: true
            });

            $("input[name^='ie']").inputmask({
                mask: ['999.999.9999'],
                keepStatic: true
            });

            $("input[name^='phone']").inputmask({
                mask: ['(99)9999-9999', '(99)99999-9999', '+99(099)9999-9999', '+99(099)99999-9999'],
                keepStatic: true
            });

            $("input[name='zipcode']").inputmask({
                mask: ["99999-999"],
                keepStatic: true
            });

            $('input[data-mask]').inputmask();
        }

        function getCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function setCookie(name, value, days = 1) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        function loadViewInHome(url) {
            setCookie('url', url, 7);
            $("#home_menu_container").html("");

            $("#spinner").removeClass("d-none");

            axios.get(url).then((response, error) => {
                $("#spinner").addClass("d-none");
                $("#home_menu_container").html(response.data);
                defaultMasks();
                moveCards();
            })
        }
        // POST/PUT data from request
        request.makeRequest("data-sendrequest", (response) => {
            $("div#errors ul").html("");
            $("input").removeClass("is-invalid");
            if (response.status === 422) {
                Object.keys(response.data.errors).map(function(field, index) {
                    let value = response.data.errors[field];
                    let translate = [{
                            "field": "zipcode",
                            "translate": "CEP"
                        },
                        {
                            "field": "street",
                            "translate": "Endereco"
                        },
                        {
                            "field": "uf",
                            "translate": "Estado"
                        },
                        {
                            "field": "district",
                            "translate": "Bairro"
                        },
                        {
                            "field": "city",
                            "translate": "Cidade"
                        },
                        {
                            "field": "account number",
                            "translate": "Numero da Conta"
                        },
                        {
                            "field": "number",
                            "translate": "Numero"
                        },
                        {
                            "field": "complement",
                            "translate": "Complemento"
                        },
                        {
                            "field": "phone",
                            "translate": "Telefone"
                        },
                        {
                            "field": "name",
                            "translate": "Nome"
                        },
                    ];
                    value.map(error => {
                        let err = error;
                        translate.map(trs => {
                            err = err.replace(trs.field, trs.translate);
                        });
                        $("div#errors ul").append('<li>' + err + '</li>')
                    });
                    $("input[name='" + field + "']").addClass("is-invalid");
                    $("div#errors").removeClass("d-none");
                });
                Toast.fire({
                    icon: 'error',
                    title: "alguns campos estão divergentes"
                });
            }
            if (response.status === 500) {
                $("div#errors").addClass("d-none");
                Toast.fire({
                    icon: 'error',
                    title: response.data.message
                });
            }
            if (response.status === 200) {
                $("div#errors").addClass("d-none");
                Toast.fire({
                    icon: 'success',
                    title: response.data.message
                });
                if (response.data.type == "delete") {
                    loadViewInHome(response.data.url);
                }
            }
        });


        // Delete data form request
        request.makeRequest("data-deleterequest", (response) => {
            if (response.status === 500) {
                Toast.fire({
                    icon: 'error',
                    title: 'Houve um erro tente novamente , ou contacte o suporte'
                });
            }
            if (response.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: 'Funcionario Deletado'
                });
                if (response.data.type == "delete") {
                    loadViewInHome(response.data.url);
                }
            }
        });

        // Save SKU from request TESTE
        request.makeRequest("data-submitajax", (response) => {
            if (response.status === 500) {
                Toast.fire({
                    icon: 'error',
                    title: response.data.message
                });
            }
            if (response.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: response.data.message
                });
                if (response.data.type == "delete") {
                    loadViewInHome(response.data.url);
                }
            }
        });

        function moveCards() {
            // Make the dashboard widgets sortable Using jquery UI
            $('.connectedSortable').sortable({
                placeholder: 'sort-highlight',
                connectWith: '.connectedSortable',
                handle: '.card-header, .nav-tabs',
                forcePlaceholderSize: true,
                zIndex: 999999
            })
            $('.connectedSortable .card-header, .connectedSortable .nav-tabs-custom').css('cursor', 'move')

        }
    </script>
</body>

</html>
