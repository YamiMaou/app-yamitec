<section class="container">
    <div class="row">
        @php
        $back = "";
        @endphp

        @foreach($breadcrumb as $bread)
            @if($loop->index === 1)
                @php
                $back = $bread;
                $_COOKIE['view'] = $back;
                @endphp
            @endif
        @endforeach
        <div class="col-md-12">
            <div class="col-md-4 float-sm-left">
                <a class="btn btn-outline-secondary btn-sm" onclick="loadViewInHome('{{url($breadcrumb[count($breadcrumb)-1] == $back ?'/home' : $back )}}')">Voltar</a>
            </div>
            <ol class="breadcrumb float-sm-right">
                @foreach($breadcrumb as $bread)
                @if ($loop->first)
                <li class="breadcrumb-item"><a>Home</a></li>
                @elseif($loop->last)
                <li class="breadcrumb-item active"><a>{{ $bread }}</a></li>
                @else
                <li class="breadcrumb-item"><a>{{ $bread }}</a></li>
                @endif
                @endforeach
            </ol>
        </div>
    </div>
    <div class="card">
        <div class="card-header">
            <h1 class="card-title">
                {{$title ?? ""}}
            </h1>
            <div class="card-tools">
                @yield('card-tools')
            </div>
        </div>
        <!-- /.card-header -->
        <div class="card-body">
            @yield('card-body')
        </div>
        <!-- /.card-body -->
    </div>
</section>
