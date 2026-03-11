# Judobase Proxy — Time Brasil Intelligence

Proxy para a API do Judobase (IJF) que resolve CORS e adiciona cache.

## Deploy no Vercel (5 minutos)

### Passo 1: Criar conta no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up" → "Continue with GitHub"
3. Autorize o Vercel a acessar seu GitHub

### Passo 2: Subir o código no GitHub
1. Crie um repositório: `judobase-proxy`
2. Suba os 3 arquivos: `api/judo.js`, `vercel.json`, `package.json`

### Passo 3: Deploy
1. No Vercel, clique "Add New Project"
2. Selecione o repositório `judobase-proxy`
3. Clique "Deploy"
4. Pronto! Seu proxy fica em: `https://judobase-proxy.vercel.app`

## Como usar

A URL base é: `https://judobase-proxy.vercel.app/api/judo`

### Exemplos de chamadas:

```
# Lista de países
/api/judo?action=country.get_list

# Info do Brasil
/api/judo?action=country.info&id_country=33

# Info de um judoca (Bia Souza)
/api/judo?action=competitor.info&id_person=XXXXX

# Ranking atual de um judoca
/api/judo?action=competitor.wrl_current&id_person=XXXXX

# Histórico de ranking
/api/judo?action=competitor.wrl_history&id_person=XXXXX

# Competições de 2026
/api/judo?action=competition.get_list&year=2026

# Detalhes de uma competição
/api/judo?action=competition.info&id_competition=XXXXX

# Lutas de uma competição
/api/judo?action=contest.find&id_competition=XXXXX

# Lutas de um atleta específico
/api/judo?action=contest.find&id_person=XXXXX

# Lutas de uma competição por categoria de peso
/api/judo?action=contest.find&id_competition=XXXXX&id_weight=14
```

### Categorias de peso (id_weight):
| ID | Masculino | ID | Feminino |
|----|-----------|-----|----------|
| 1  | -60kg     | 8   | -48kg    |
| 2  | -66kg     | 9   | -52kg    |
| 3  | -73kg     | 10  | -57kg    |
| 4  | -81kg     | 11  | -63kg    |
| 5  | -90kg     | 12  | -70kg    |
| 6  | -100kg    | 13  | -78kg    |
| 7  | +100kg    | 14  | +78kg    |

## Cache
Respostas são cacheadas por 1 hora. Header `X-Cache: HIT` indica cache.

## Integração com o Dashboard
No JavaScript do dashboard, chamar assim:

```javascript
const PROXY = "https://judobase-proxy.vercel.app/api/judo";

// Buscar info do Brasil
const brazil = await fetch(`${PROXY}?action=country.info&id_country=33`).then(r => r.json());

// Buscar ranking atual de um atleta
const ranking = await fetch(`${PROXY}?action=competitor.wrl_current&id_person=12345`).then(r => r.json());
```
