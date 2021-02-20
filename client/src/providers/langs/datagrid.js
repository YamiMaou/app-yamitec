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
    toolbarFiltersLabel: 'Show Filters',
    toolbarFiltersTooltipHide: 'Hide Filters',
    toolbarFiltersTooltipShow: 'Show Filters',
    toolbarFiltersTooltipActive: (count) => `${count} active filter(s)`,
  
    // Columns panel text
    columnsPanelTextFieldLabel: 'Find column',
    columnsPanelTextFieldPlaceholder: 'Column title',
    columnsPanelDragIconLabel: 'Reorder Column',
    columnsPanelShowAllButton: 'Show All',
    columnsPanelHideAllButton: 'Hide All',
  
    // Filter panel text
    filterPanelAddFilter: 'Add Filter',
    filterPanelDeleteIconLabel: 'Delete',
    filterPanelOperators: 'Operators',
    filterPanelOperatorAnd: 'And',
    filterPanelOperatorOr: 'Or',
    filterPanelColumns: 'Columns',
    filterPanelInputLabel: 'Value',
    filterPanelInputPlaceholder: 'Filter value',
  
    // Filter operators text
    filterOperatorContains: 'contains',
    filterOperatorEquals: 'equals',
    filterOperatorStartsWith: 'starts with',
    filterOperatorEndsWith: 'ends with',
    filterOperatorIs: 'is',
    filterOperatorNot: 'is not',
    filterOperatorOnOrAfter: 'is on or after',
    filterOperatorBefore: 'is before',
    filterOperatorOnOrBefore: 'is on or before',
  
    // Column menu text
    columnMenuLabel: 'Menu',
    columnMenuShowColumns: 'Show columns',
    columnMenuFilter: 'Filter',
    columnMenuHideColumn: 'Hide',
    columnMenuUnsort: 'Unsort',
    columnMenuSortAsc: 'Sort by Asc',
    columnMenuSortDesc: 'Sort by Desc',
  
    // Column header text
    columnHeaderFiltersTooltipActive: (count) => `${count} active filter(s)`,
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