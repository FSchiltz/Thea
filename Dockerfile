# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine AS build

RUN apk add --update npm
WORKDIR /source

# copy everything else and build app
COPY ./Thea ./app/
WORKDIR /source/app
RUN  dotnet publish -o /app  -c release -r alpine-x64 --self-contained true -p:PublishSingleFile=true -p:UseAppHost=true -p:PublishTrimmed=true -p:SuppressTrimAnalysisWarnings=true

# final stage/image
FROM mcr.microsoft.com/dotnet/runtime-deps:6.0-alpine
WORKDIR /app
COPY --from=build /app ./


EXPOSE 80

ENV DOTNET_EnableDiagnostics=0
ENTRYPOINT ["./Thea"]

