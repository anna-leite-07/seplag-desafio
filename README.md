# Sistema de Acompanhamento da Execução Orçamentária — SEPLAG

Painel web para consulta e acompanhamento da execução orçamentária de órgãos estaduais, desenvolvido como desafio técnico para vaga de Desenvolvedor(a) Full Stack Pleno.

## Stack utilizada

| Camada | Tecnologia |
|---|---|
| Backend | Laravel 13.18.1 (ver nota abaixo sobre versão) |
| Frontend | React 19 + TypeScript + Vite |
| Banco de dados | MySQL 8.0 |
| Estilização | Tailwind CSS |
| Autenticação | JWT (php-open-source-saver/jwt-auth) |
| Infraestrutura | Docker + Docker Compose |

### Nota sobre a versão do Laravel

O enunciado solicitava Laravel 12; por engano na instalação inicial do ambiente, o projeto foi criado em **Laravel 13**. Dado o estágio avançado do desenvolvimento no momento em que o engano foi percebido, e o prazo do desafio, optei por não fazer o downgrade. As mudanças entre as versões 12 e 13 são incrementais, não estruturais, e não impactam os padrões, a arquitetura ou as práticas usadas neste projeto.

### Por que MySQL

Optei por MySQL por ser o banco com o qual já tinha mais familiaridade prévia e por oferecer uma configuração simples para o ambiente proposto, além de boa integração com Laravel e amplo suporte nas ferramentas utilizadas durante o desenvolvimento. A modelagem não usa nenhum recurso específico de MySQL que impeça migração futura para PostgreSQL, caso necessário.


### Por que Tailwind CSS

Escolhido por permitir desenvolvimento rápido de interfaces responsivas diretamente nos componentes React, reduzindo a necessidade de arquivos CSS separados e favorecendo a padronização visual da aplicação.

## Como executar o projeto

### Opção 1 — Docker (recomendada)

Pré-requisito: Docker Desktop instalado e em execução.

Na raiz do projeto:

```bash
docker compose up --build
```

Isso sobe automaticamente:
- Banco de dados MySQL
- Backend Laravel (rodando migrations e seeders automaticamente na inicialização)
- Frontend React

Após subir, a aplicação estará disponível em:
- Frontend: http://localhost:5173
- Backend/API: http://localhost:8000/api

Nenhuma configuração manual adicional é necessária — o comando já executa `migrate:fresh --seed` automaticamente a cada subida dos containers.

### Opção 2 — Ambiente local, sem Docker

**Backend:**

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
# ajuste as credenciais do banco no .env
php artisan migrate:fresh --seed
php artisan serve
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Credenciais de acesso

```
E-mail: analista@seplag.rj.gov.br
Senha: orcamento@2026
```

## Estrutura do projeto

```
seplag-desafio/
├── backend/          # API Laravel
├── frontend/          # SPA React + TypeScript
├── docker-compose.yml
└── README.md
```

### Backend

```
app/
├── Http/Controllers/Api/   # Controllers da API (somente leitura, exceto revisão)
├── Models/                 # Models Eloquent com relacionamentos e accessors
database/
├── migrations/
├── seeders/                # OrcamentoSeeder gera orçamentos + movimentações
├── factories/
```

### Frontend

```
src/
├── pages/          # Telas: Login, Dashboard, Orcamentos, OrcamentoDetalhe
├── components/     # Componentes reutilizáveis (CampoInfo, Layout, etc.)
├── context/        # AuthContext (autenticação global)
├── routes/         # Configuração de rotas e proteção de rotas
├── services/       # Configuração do axios (api.ts)
├── types/          # Interfaces TypeScript dos dados da API
```

## Funcionalidades implementadas

- Autenticação via JWT.
- Dashboard com indicadores consolidados da execução orçamentária.
- Consulta de órgãos com filtros e paginação.
- Consulta de contratos com filtros.
- Consulta de orçamentos com filtros, paginação e detalhamento.
- Registro de revisões em orçamentos autenticados.
- Gráficos com dados agregados para apoio à análise.
- Ambiente inicializado automaticamente com migrations, seeders e factories.

## Arquitetura

A aplicação foi desenvolvida em arquitetura cliente-servidor, com frontend e backend desacoplados.

- O backend disponibiliza uma API REST responsável pela autenticação, regras de negócio e acesso aos dados.
- O frontend consome essa API via Axios, gerenciando autenticação, navegação e apresentação das informações ao usuário.
- A comunicação entre as camadas ocorre exclusivamente por requisições HTTP em formato JSON.

## Decisões arquiteturais

### Autenticação

Usei **JWT Auth** (`php-open-source-saver/jwt-auth`) em vez de Laravel Sanctum e optei por **não implementar renovação silenciosa de token**. Ao expirar (24 horas), o usuário é deslogado de forma reativa (qualquer chamada à API que retorne 401 aciona logout automático). Essa decisão prioriza simplicidade dado o escopo e o prazo do desafio.

No backend, apenas o endpoint `PATCH /orcamentos/:id/revisao` exige autenticação, conforme especificado no enunciado. Todos os `GET`s são públicos na API. No frontend, optei por proteger visualmente todas as telas internas (exceto login), como decisão de UX — isso não substitui a proteção real, que está no backend.

### Valores derivados (dotação atualizada e percentual de execução)

`dotacao_atualizada` e `percentual_execucao` **não são colunas físicas** no banco — são calculados dinamicamente via accessors no model `Orcamento`, usando `withSum()` para agregar as movimentações (suplementações e anulações) de forma performática, em uma única query com subqueries agregadas, evitando processamento adicional na camada da aplicação.

Optei por não denormalizar (guardar o valor calculado fisicamente em uma coluna) porque a criação de movimentações não passa por um único ponto controlado — existe uma factory própria para `OrcamentoMovimentacao`, o que tornaria arriscado manter um valor "cacheado" sempre sincronizado sem um mecanismo adicional (Observer/trigger) que não se justifica para o escopo deste desafio.

### Dados inconsistentes propositais

O `OrcamentoSeeder` gera cinco perfis de orçamento, com as seguintes proporções aproximadas: saudável (60%), sem execução (10%), quase concluído (20%), saldo negativo (5%) e inconsistente — pago maior que liquidado, ou liquidado maior que empenhado (5%). Esses casos não são escondidos ou corrigidos pela aplicação; são exibidos normalmente, permitindo que o analista identifique anomalias.

Campos ausentes ou nulos (ex.: quando um orçamento não possui contratos vinculados, ou uma revisão não possui observação) são tratados na interface com a mensagem "Informação não disponível" ou equivalente, em vez de espaços em branco.

## Principais trade-offs

- **Filtro de percentual de execução no backend**: implementado via `havingRaw` com subqueries agregadas, calculando percentual sobre a dotação atualizada real (incluindo movimentações). Os valores de filtro não são limitados a 0-100%, propositalmente, para não esconder os casos de saldo negativo/inconsistência que o próprio enunciado pede para sinalizar.
- **"Evolução mensal da execução"** (um dos exemplos de gráfico sugeridos pelo enunciado) não foi implementado: os dados gerados pelo seeder representam totais únicos de empenhado/liquidado/pago por orçamento, sem granularidade temporal mensal real. Implementar esse gráfico exigiria distribuir esses valores artificialmente ao longo dos meses, o que geraria números fictícios sem lastro nos dados — optei por não implementar esse gráfico e priorizar visualizações baseadas em dados efetivamente representados pela base gerada.

## Melhorias que seriam implementadas com mais tempo

- Refatoração dos controllers para usar **API Resources** do Laravel, em vez de `select()`/`with()` diretamente nas queries — mais alinhado ao padrão de mercado para formatação de resposta JSON.
- Exportação de dados em PDF/Excel.
- Telas dedicadas para Órgãos e Contratos, com filtros próprios explorando os endpoints já existentes.
- Modo escuro.

## Uso de Inteligência Artificial

Durante o desenvolvimento, utilizei ferramentas de inteligência artificial como apoio durante o processo, principalmente para:

- Esclarecer dúvidas sobre Laravel, React e JWT;
- Discutir alternativas de modelagem e arquitetura;
- Revisar trechos de código;
- Explicar conceitos e boas práticas das tecnologias utilizadas.

Todas as decisões de implementação, adaptações ao contexto do projeto, integração entre as camadas da aplicação e validação do funcionamento foram realizadas manualmente. O código foi desenvolvido, compreendido, testado e revisado por mim antes de ser incorporado ao projeto, e estou apta a explicar e defender tecnicamente qualquer parte dele.

## Considerações finais

Este projeto foi desenvolvido como parte de um desafio técnico e teve como objetivo demonstrar conhecimentos em modelagem de dados, integração entre backend e frontend, consumo de APIs, desenvolvimento de APIs REST, autenticação e construção de interfaces responsivas.

Ao longo do desenvolvimento foram priorizadas clareza de código, organização da arquitetura e consistência dos dados, buscando reproduzir cenários próximos aos encontrados em sistemas de acompanhamento da execução orçamentária.