@Library('jenkings') _

pipeline {
  agent {
    docker {
      label 'docker'
      image 'node:10-alpine'
      args '-e HOME=$WORKSPACE'
    }
  }

  environment {
    chatId = '11114225'
    CI = 'true'
  }

  stages {
    stage('Install packages') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      environment {
        REACT_APP_FLICKR_API_KEY = credentials('melchor9000-flickr-api-key')
      }

      steps {
        sh 'npm run build'
      }
    }

    stage('Deploy') {
      when {
        branch 'master'
      }

      environment {
        FIREBASE_TOKEN = credentials('firebase-melchor9000')
      }

      steps {
        sh 'node_modules/.bin/firebase deploy --project melchor9000-me'
      }

      post {
        success {
          telegramSend 'Your page has been deployed successfully.\n\nSee [pipeline here](' + env.BUILD_URL + ')', chatId
        }

        failure {
          telegramSend 'Could not deploy your page.\n\nSee [pipeline here](' + env.BUILD_URL + ')', chatId
        }
      }
    }
  }
}
