docker-compose build
# Google Cloud
# docker tag ups_mail_api:local gcr.io/upsmarting/ups_mail_api:v1.0.11
# docker push gcr.io/upsmarting/ups_mail_api:v1.0.11
# AWS
docker tag ups_mail_api:local 017446926792.dkr.ecr.eu-north-1.amazonaws.com/ups_mail_api:v1.0.1
docker push 017446926792.dkr.ecr.eu-north-1.amazonaws.com/ups_mail_api:v1.0.1