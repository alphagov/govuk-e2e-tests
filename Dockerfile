FROM --platform=$TARGETPLATFORM public.ecr.aws/lts/ubuntu:24.04_stable
ARG TARGETARCH

ENV APP_HOME=/app \
    TZ=Europe/London

SHELL ["/bin/bash", "-euo", "pipefail", "-c"]

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl gpg ca-certificates

RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor > /usr/share/keyrings/nodesource.gpg

RUN apt-get install -y --no-install-recommends nodejs npm;\
    echo -n node version:\ ; node -v; \
    echo -n npm version:\ ; npm -v; \
    npm install -g yarn@1.22.19

RUN groupadd -g 1001 app; \
    useradd -u 1001 -g app app --home $APP_HOME

WORKDIR $APP_HOME
COPY package.json yarn.lock ./
RUN  yarn install --immutable
RUN PLAYWRIGHT_BROWSERS_PATH=$APP_HOME/.cache/ms-playwright yarn playwright install --with-deps chromium && \
    rm -r /var/lib/apt/lists /var/cache/apt/archives

COPY playwright.config.js ./
COPY tests/ ./tests/
COPY lib/ ./lib/
RUN chown -R app:app $APP_HOME

USER app
CMD [ "yarn", "playwright", "test", "--reporter=list" ]
