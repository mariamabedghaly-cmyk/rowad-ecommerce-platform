# ---- build ----
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY PaymentService.csproj nuget.config ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# ---- runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/data && chown -R $APP_UID /app/data
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5003 \
    ConnectionStrings__DefaultConnection="Data Source=/app/data/payments.db"
USER $APP_UID
EXPOSE 5003
VOLUME ["/app/data"]
HEALTHCHECK --interval=15s --timeout=3s --start-period=15s --retries=3 \
  CMD curl -fs http://127.0.0.1:5003/health || exit 1

ENTRYPOINT ["dotnet", "PaymentService.dll"]
