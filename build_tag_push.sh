docker-compose build
docker tag ups_mail_api:local gcr.io/upsmarting/ups_mail_api:v1.0.7
docker push gcr.io/upsmarting/ups_mail_api:v1.0.7
