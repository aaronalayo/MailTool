docker-compose build
docker tag ups_mail_api:local gcr.io/upsmarting/ups_mail_api:v1.0.2
docker push gcr.io/upsmarting/ups_mail_api:v1.0.2