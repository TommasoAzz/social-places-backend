FROM python:3.9.6-alpine

RUN mkdir /context_aware/
WORKDIR /context_aware/

COPY requirements.txt /context_aware/

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /context_aware/

EXPOSE 4000

ENTRYPOINT ["python3"]

CMD ["-m", "contextaware"]