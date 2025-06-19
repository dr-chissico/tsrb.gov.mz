import { useState, useEffect } from 'react'
import { Search, Filter, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const CaseSearchPage = () => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    case_number: '',
    party_name: '',
    case_type: '',
    status: '',
    date_from: '',
    date_to: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0,
    has_next: false,
    has_prev: false
  })
  const [caseTypes, setCaseTypes] = useState([])
  const [statuses, setStatuses] = useState([])

  useEffect(() => {
    fetchCaseTypes()
    fetchStatuses()
    searchCases()
  }, [])

  const fetchCaseTypes = async () => {
    try {
      const response = await fetch('https://kkh7ikcgn7ol.manus.space/api/cases/types')
      const data = await response.json()
      if (data.success) {
        setCaseTypes(data.case_types)
      }
    } catch (error) {
      console.error('Erro ao carregar tipos de processo:', error)
    }
  }

  const fetchStatuses = async () => {
    try {
      const response = await fetch('https://kkh7ikcgn7ol.manus.space/api/cases/statuses')
      const data = await response.json()
      if (data.success) {
        setStatuses(data.statuses)
      }
    } catch (error) {
      console.error('Erro ao carregar estados:', error)
    }
  }

  const searchCases = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...searchParams,
        page: page.toString(),
        per_page: pagination.per_page.toString()
      })

      // Remover parâmetros vazios
      Object.keys(searchParams).forEach(key => {
        if (!searchParams[key]) {
          params.delete(key)
        }
      })

      const response = await fetch(`https://kkh7ikcgn7ol.manus.space/api/cases/search?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setCases(data.cases)
        setPagination(data.pagination)
      } else {
        console.error('Erro na pesquisa:', data.error)
      }
    } catch (error) {
      console.error('Erro ao pesquisar processos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    searchCases(1)
  }

  const handlePageChange = (newPage) => {
    searchCases(newPage)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'open': { label: 'Aberto', variant: 'default' },
      'pending': { label: 'Pendente', variant: 'secondary' },
      'closed': { label: 'Encerrado', variant: 'outline' },
      'suspended': { label: 'Suspenso', variant: 'destructive' }
    }
    
    const statusInfo = statusMap[status] || { label: status, variant: 'default' }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const getCaseTypeBadge = (type) => {
    const typeMap = {
      'civil': { label: 'Civil', color: 'bg-blue-100 text-blue-800' },
      'criminal': { label: 'Criminal', color: 'bg-red-100 text-red-800' },
      'family': { label: 'Família', color: 'bg-green-100 text-green-800' },
      'probate': { label: 'Sucessões', color: 'bg-purple-100 text-purple-800' }
    }
    
    const typeInfo = typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
        {typeInfo.label}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-PT')
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pesquisa de Processos</h1>
          <p className="text-muted-foreground">
            Consulte o estado dos processos judiciais públicos
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Critérios de Pesquisa
            </CardTitle>
            <CardDescription>
              Utilize os filtros abaixo para encontrar os processos desejados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Número do Processo</label>
                <Input
                  placeholder="Ex: 2024/CV/001"
                  value={searchParams.case_number}
                  onChange={(e) => handleInputChange('case_number', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Nome da Parte</label>
                <Input
                  placeholder="Nome do requerente ou requerido"
                  value={searchParams.party_name}
                  onChange={(e) => handleInputChange('party_name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Processo</label>
                <select 
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={searchParams.case_type} 
                  onChange={(e) => handleInputChange('case_type', e.target.value)}
                >
                  <option value="">Todos os tipos</option>
                  {caseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <select 
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={searchParams.status} 
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="">Todos os estados</option>
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Data Inicial</label>
                <Input
                  type="date"
                  value={searchParams.date_from}
                  onChange={(e) => handleInputChange('date_from', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Data Final</label>
                <Input
                  type="date"
                  value={searchParams.date_to}
                  onChange={(e) => handleInputChange('date_to', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'A pesquisar...' : 'Pesquisar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchParams({
                    case_number: '',
                    party_name: '',
                    case_type: '',
                    status: '',
                    date_from: '',
                    date_to: ''
                  })
                  searchCases(1)
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Pesquisa</CardTitle>
            <CardDescription>
              {pagination.total > 0 
                ? `Encontrados ${pagination.total} processos`
                : 'Nenhum processo encontrado'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">A carregar...</p>
              </div>
            ) : cases.length > 0 ? (
              <>
                <div className="space-y-4">
                  {cases.map((case_item) => (
                    <div key={case_item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{case_item.case_number}</h3>
                            {getCaseTypeBadge(case_item.case_type)}
                            {getStatusBadge(case_item.status)}
                          </div>
                          <p className="text-foreground mb-1">{case_item.title}</p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>Requerente:</strong> {case_item.plaintiff}</p>
                            <p><strong>Requerido:</strong> {case_item.defendant}</p>
                            {case_item.judge && <p><strong>Juiz:</strong> {case_item.judge}</p>}
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:items-end gap-2">
                          <div className="text-sm text-muted-foreground">
                            <p><strong>Registo:</strong> {formatDate(case_item.filing_date)}</p>
                            {case_item.next_hearing && (
                              <p className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                <strong>Próxima audiência:</strong> {formatDate(case_item.next_hearing)}
                              </p>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                      Página {pagination.page} de {pagination.pages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.has_prev}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.has_next}
                      >
                        Próxima
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum processo encontrado com os critérios especificados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CaseSearchPage

