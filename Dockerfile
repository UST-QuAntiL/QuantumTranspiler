FROM rigetti/quilc:1.20.0 as quilc
FROM rigetti/qvm:1.17.1 as qvm
FROM python:3.8-buster

# use an entrypoint script to add startup commands (qvm & quilc server spinup)
WORKDIR /code
# Installing QVM and quilc (https://github.com/rigetti/pyquil/blob/master/Dockerfile)

# copy over the pre-built quilc binary from the first build stage
COPY --from=quilc /src/quilc/quilc /usr/local/bin/quilc

# copy over the pre-built qvm binary from the second build stage
COPY --from=qvm /src/qvm/qvm /usr/local/bin/qvm

# install the missing apt packages that aren't copied over
RUN apt-get update && apt-get -yq dist-upgrade && \
    apt-get install --no-install-recommends -yq \
    git libblas-dev libffi-dev liblapack-dev libzmq3-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

# Installing .NET (https://github.com/microsoft/iqsharp/blob/main/images/iqsharp-base/Dockerfile)
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

#ENV PATH=$PATH:${HOME}/dotnet:${HOME}/.dotnet/tools \
#    DOTNET_ROOT=${HOME}/dotnet

RUN dotnet new -i "Microsoft.Quantum.ProjectTemplates::0.26.233415"
RUN dotnet tool install \
           --global \
           Microsoft.Quantum.IQSharp
RUN ~/.dotnet/tools/dotnet-iqsharp install --user --path-to-tool="~/.dotnet/tools/dotnet-iqsharp"

COPY . .
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 5012

CMD [ "python", "-m","api.api_service" ]