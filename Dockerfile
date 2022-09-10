# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
WORKDIR /source

# copy everything else and build app
COPY ./Thea ./app/
WORKDIR /source/app
RUN dotnet publish -c release -o /app 

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app ./

ENV DOTNET_EnableDiagnostics=0
ENTRYPOINT ["dotnet", "Thea.dll"]

