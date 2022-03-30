FROM python:3.8

WORKDIR /code

COPY requirements.txt .
RUN pip install -r requirements.txt

# Notice that we're installing the SDK for both .NET Core 3.1 as well as .NET 6.0 for compatibility.
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg && \
    mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/ && \
    wget -q https://packages.microsoft.com/config/debian/9/prod.list && \
    mv prod.list /etc/apt/sources.list.d/microsoft-prod.list && \
    chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg && \
    chown root:root /etc/apt/sources.list.d/microsoft-prod.list && \
    apt-get -y update && \
    apt-get -y install dotnet-sdk-3.1=3.1.416-1 dotnet-sdk-6.0 && \
    apt-get -y install procps && \
    apt-get clean && rm -rf /var/lib/apt/lists/

ENV PATH=$PATH:${HOME}/dotnet:${HOME}/.dotnet/tools \
    DOTNET_ROOT=${HOME}/dotnet

RUN dotnet new -i "Microsoft.Quantum.ProjectTemplates::0.23.198514-beta"
RUN dotnet tool install \
           --global \
           Microsoft.Quantum.IQSharp
RUN ~/.dotnet/tools/dotnet-iqsharp install --user --path-to-tool="~/.dotnet/tools/dotnet-iqsharp"

COPY . .
EXPOSE 5012

CMD [ "python", "-m","api.api_service" ]