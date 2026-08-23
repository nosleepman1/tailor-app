#!/bin/bash
# ==============================================================================
# TailleurPro — Script d'installation automatique du GitHub Runner Self-Hosted
# Compatible: Ubuntu 22.04 / 24.04 LTS & Debian 12
# ==============================================================================

set -e

echo "=================================================================="
echo "🚀 [TailleurPro] Installation du GitHub Actions Runner Self-Hosted"
echo "=================================================================="

# 1. Mise à jour du système & dépendances
echo "📦 1. Installation des dépendances système..."
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release git jq ufw

# 2. Installation de Docker & Docker Compose Plugin
if ! command -v docker &> /dev/null; then
    echo "🐳 2. Installation de Docker Engine & Docker Compose..."
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    sudo systemctl enable docker
    sudo systemctl start docker
    echo "✅ Docker installé avec succès !"
else
    echo "✅ Docker est déjà installé."
fi

# 3. Ajout de l'utilisateur au groupe docker
echo "👤 3. Configuration des permissions Docker..."
sudo usermod -aG docker "$USER"

# 4. Téléchargement du Runner GitHub Actions
RUNNER_DIR="$HOME/actions-runner"
echo "📥 4. Préparation du répertoire runner dans $RUNNER_DIR..."
mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

if [ ! -f "config.sh" ]; then
    # Récupérer la dernière version du runner depuis l'API GitHub
    RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | jq -r .tag_name | sed 's/v//')
    RUNNER_VERSION=${RUNNER_VERSION:-"2.317.0"}

    echo "Téléchargement du runner version v${RUNNER_VERSION}..."
    curl -o actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz -L https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz
    tar xzf ./actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz
    rm -f actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz
fi

# 5. Instructions de connexion au dépôt GitHub
echo ""
echo "=================================================================="
echo "🔑 5. Configuration du Runner avec votre Dépôt GitHub"
echo "=================================================================="
echo "Pour lier ce runner à votre projet GitHub :"
echo "1. Rendez-vous sur : https://github.com/nosleepman1/tailor-app/settings/actions/runners/new"
echo "2. Copiez la commande de configuration avec votre TOKEN généré."
echo "   Exemple : ./config.sh --url https://github.com/nosleepman1/tailor-app --token VOTRE_TOKEN"
echo "3. Définissez les labels : self-hosted, linux, tailor-prod"
echo ""
echo "Une fois la commande ./config.sh exécutée, installez le service systemd 24/7 :"
echo "   sudo ./svc.sh install"
echo "   sudo ./svc.sh start"
echo "   sudo ./svc.sh status"
echo "=================================================================="
