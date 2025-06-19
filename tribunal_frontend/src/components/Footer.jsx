import { Scale, MapPin, Phone, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold">Tribunal</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Sistema moderno de gestão judicial, proporcionando acesso transparente 
              e eficiente aos serviços do tribunal para todos os cidadãos.
            </p>
            <p className="text-sm text-primary-foreground/60">
              Justiça • Integridade • Serviço
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Página Inicial
                </a>
              </li>
              <li>
                <a href="/cases" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Pesquisa de Processos
                </a>
              </li>
              <li>
                <a href="/forms" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Formulários
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Calendário de Audiências
                </a>
              </li>
            </ul>
          </div>

          {/* Contactos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contactos</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-sm text-primary-foreground/80">
                  Rua da Justiça, 123<br />
                  1000-001 Lisboa
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-sm text-primary-foreground/80">
                  +351 21 123 4567
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-sm text-primary-foreground/80">
                  info@tribunal.pt
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha de Separação */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-primary-foreground/60">
              © 2024 Tribunal. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                Acessibilidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

