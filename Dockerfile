# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

RUN apk add --update npm
WORKDIR /source

# copy and publish app and libraries
COPY ./Thea .
RUN  dotnet publish -o /app -c release

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app ./

EXPOSE 80

ENV DOTNET_EnableDiagnostics=0
ENTRYPOINT ["dotnet", "Thea.dll"]

