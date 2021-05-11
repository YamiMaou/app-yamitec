export const DEFAULT_LOCALE_TEXT = {
    // Root
    rootGridLabel: 'grid',
    noRowsLabel: 'Não há registros para exibir',
    errorOverlayDefaultLabel: 'Ocorreu um erro.',
  
    // Density selector toolbar button text
    toolbarDensity: 'Tamanho',
    toolbarDensityLabel: 'Tamanho',
    toolbarDensityCompact: 'Compacto',
    toolbarDensityStandard: 'Padrão',
    toolbarDensityComfortable: 'Confortavel',
  
    // Columns selector toolbar button text
    toolbarColumns: 'Colunas',
    toolbarColumnsLabel: 'Exibir seletor de coluna',
  
    // Filters toolbar button text
    toolbarFilters: 'Filters',
    toolbarFiltersLabel: 'Exibir Filtros',
    toolbarFiltersTooltipHide: 'Esconder Filtros',
    toolbarFiltersTooltipShow: 'Exibir Filtros',
    toolbarFiltersTooltipActive: (count) => `${count} filtro(s) ativo(s)`,
  
    // Columns panel text
    columnsPanelTextFieldLabel: 'Pesquisar Coluna',
    columnsPanelTextFieldPlaceholder: 'Titulo da Coluna',
    columnsPanelDragIconLabel: 'Reordenar Coluna',
    columnsPanelShowAllButton: 'Exibir Todos',
    columnsPanelHideAllButton: 'Ocultar Todos',
  
    // Filter panel text
    filterPanelAddFilter: 'Add Filtro',
    filterPanelDeleteIconLabel: 'Apagar',
    filterPanelOperators: 'Operadores',
    filterPanelOperatorAnd: 'E',
    filterPanelOperatorOr: 'Ou',
    filterPanelColumns: 'Colunas',
    filterPanelInputLabel: 'Valor',
    filterPanelInputPlaceholder: 'Valor do Filtro',
  
    // Filter operators text
    filterOperatorContains: 'Contém',
    filterOperatorEquals: 'igual',
    filterOperatorStartsWith: 'inicia com',
    filterOperatorEndsWith: 'termina com',
    filterOperatorIs: 'é',
    filterOperatorNot: 'não é',
    filterOperatorOnOrAfter: 'é em ou depois',
    filterOperatorBefore: 'é depois',
    filterOperatorOnOrBefore: 'é em ou antes',
  
    // Column menu text
    columnMenuLabel: 'Menu',
    columnMenuShowColumns: 'Exibir colunas',
    columnMenuFilter: 'Filtro',
    columnMenuHideColumn: 'Esconder',
    columnMenuUnsort: 'Não Classificar',
    columnMenuSortAsc: 'Classificar por ASC',
    columnMenuSortDesc: 'Classificar por Desc',
  
    // Column header text
    columnHeaderFiltersTooltipActive: (count) => `${count} filtro(s) ativo(s)`,
    columnHeaderFiltersLabel: 'Filtros',
    columnHeaderSortIconLabel: 'Ordenar',
  
    // Rows selected footer text
    footerRowSelected: (count) =>
      count !== 1
        ? `${count.toLocaleString()} linhas selecionadas`
        : `${count.toLocaleString()} linha selecionada`,
  
    // Total rows footer text
    footerTotalRows: 'Total de Registros:',
  
    // Pagination footer text
    footerPaginationRowsPerPage: 'registros por página:',
    footerPaginationOf: 'de'
  };