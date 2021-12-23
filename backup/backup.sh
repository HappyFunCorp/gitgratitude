#!/bin/bash

set -eo pipefail
set -o pipefail

echo Dumping ${PGNAME}
pg_dump ${PGNAME} | gzip > ${PGNAME}.sql.gz

echo Uploading ${PGNAME}
if [ -z "${AWS_ACCESS_KEY_ID}" ]; then
    echo AWS_ACCESS_KEY_ID not set, skipping

    exit 1
fi

if [ -z "${AWS_END_POINT}" ]; then
  AWS_ARGS=""
else
  AWS_ARGS="--endpoint-url https://${AWS_END_POINT}"
fi

date +"%Y-%m-%dT%H:%M:%SZ"

cat ${PGNAME}.sql.gz | aws $AWS_ARGS s3 cp - s3://$BUCKET_NAME/backups/${PGNAME}_$(date +"%Y-%m-%dT%H:%M:%SZ").sql.gz || exit 2
