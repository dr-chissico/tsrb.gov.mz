import { Link } from 'react-router-dom'
import { Search, FileText, Calendar, ArrowRight, Scale, Users, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const HomePage = () => {
  const services = [
    {
      icon: Search,
      title: 'Pesquisa de Processos',
      description: 'Consulte o estado dos seus processos judiciais de forma rápida e segura.',
      link: '/cases',
      color: 'text-blue-600'
    },
    {
      icon: FileText,
      title: 'Formulários Online',
      description: 'Aceda e descarregue formulários judiciais organizados por categoria.',
      link: '/forms',
      color: 'text-green-600'
    },
    {
      icon: Calendar,
      title: 'Calendário de Audiências',
      description: 'Consulte as audiências agendadas e os horários do tribunal.',
      link: '#',
      color: 'text-purple-600'
    }
  ]

  const stats = [
    { icon: Scale, label: 'Processos Ativos', value: '1,234' },
    { icon: Users, label: 'Utilizadores Registados', value: '5,678' },
    { icon: Clock, label: 'Tempo Médio de Resposta', value: '24h' },
    { icon: Shield, label: 'Segurança Garantida', value: '100%' }
  ]

  const news = [
    {
      date: '15 Jun 2024',
      title: 'Novo Sistema de Notificações Eletrónicas',
      description: 'Implementação de sistema automatizado de notificações para advogados e partes processuais.'
    },
    {
      date: '10 Jun 2024',
      title: 'Horário de Verão do Tribunal',
      description: 'Durante os meses de verão, o tribunal funcionará das 8h30 às 16h30.'
    },
    {
      date: '05 Jun 2024',
      title: 'Manutenção Programada do Sistema',
      description: 'O sistema estará indisponível no dia 20 de junho entre as 2h e as 6h para manutenção.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Justiça • Integridade • Serviço
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            Acesso moderno e transparente aos serviços judiciais. 
            Consulte processos, descarregue formulários e mantenha-se informado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cases">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                <Search className="mr-2 h-5 w-5" />
                Pesquisar Processos
              </Button>
            </Link>
            <Link to="/forms">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <FileText className="mr-2 h-5 w-5" />
                Ver Formulários
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Serviços Disponíveis
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Aceda aos principais serviços do tribunal de forma digital e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}>
                    <service.icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={service.link}>
                    <Button variant="outline" className="w-full group">
                      Aceder
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notícias e Comunicados
            </h2>
            <p className="text-lg text-muted-foreground">
              Mantenha-se informado sobre as últimas novidades do tribunal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="text-sm text-accent font-medium mb-2">{item.date}</div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Ver Todas as Notícias
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

