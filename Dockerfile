# Estágio de Produção Otimizado (Sem build no servidor)
FROM nginx:stable-alpine

# Copia os arquivos pré-compilados localmente
COPY dist /usr/share/nginx/html

# Copia a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
