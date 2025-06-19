import { useState, useEffect } from 'react'
import { FileText, Download, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FormsPage = () => {
  const [forms, setForms] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchForms()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://kkh7ikcgn7ol.manus.space/api/forms/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const fetchForms = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`https://kkh7ikcgn7ol.manus.space/api/forms?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setForms(data.forms)
      } else {
        console.error('Erro ao carregar formulários:', data.error)
      }
    } catch (error) {
      console.error('Erro ao carregar formulários:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [selectedCategory, searchTerm])

  const handleDownload = async (formId, formTitle) => {
    try {
      const response = await fetch(`https://kkh7ikcgn7ol.manus.space/api/forms/${formId}/download`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `${formTitle}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Erro ao fazer download do formulário')
      }
    } catch (error) {
      console.error('Erro ao fazer download:', error)
    }
  }

  const getCategoryInfo = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue) || { label: categoryValue, description: '' }
  }

  const getCategoryBadge = (category) => {
    const categoryMap = {
      'civil': { label: 'Civil', color: 'bg-blue-100 text-blue-800' },
      'criminal': { label: 'Criminal', color: 'bg-red-100 text-red-800' },
      'family': { label: 'Família', color: 'bg-green-100 text-green-800' },
      'probate': { label: 'Sucessões', color: 'bg-purple-100 text-purple-800' }
    }
    
    const categoryInfo = categoryMap[category] || { label: category, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
        {categoryInfo.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Formulários Judiciais</h1>
          <p className="text-muted-foreground">
            Descarregue os formulários necessários para os seus processos judiciais
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Pesquisar Formulários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Pesquisar por nome do formulário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:w-64">
                <select 
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Instruções de Utilização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Como utilizar os formulários:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Descarregue o formulário adequado ao seu processo</li>
                  <li>• Preencha todos os campos obrigatórios</li>
                  <li>• Assine e date o documento</li>
                  <li>• Entregue no tribunal ou envie por correio</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Precisa de ajuda?</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Para esclarecimentos sobre o preenchimento dos formulários:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Telefone: +351 21 123 4567</li>
                  <li>• Email: formularios@tribunal.pt</li>
                  <li>• Atendimento presencial: 9h-17h</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forms by Category */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">A carregar formulários...</p>
          </div>
        ) : Object.keys(forms).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(forms).map(([category, categoryForms]) => {
              const categoryInfo = getCategoryInfo(category)
              return (
                <Card key={category}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {categoryInfo.label}
                          {getCategoryBadge(category)}
                        </CardTitle>
                        <CardDescription>{categoryInfo.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {categoryForms.length} formulário{categoryForms.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryForms.map((form) => (
                        <div key={form.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm mb-1">{form.title}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{form.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Versão {form.version}</span>
                                <span>•</span>
                                <span>PDF</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleDownload(form.id, form.title)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Descarregar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory 
                  ? 'Nenhum formulário encontrado com os critérios especificados.'
                  : 'Nenhum formulário disponível no momento.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default FormsPage

