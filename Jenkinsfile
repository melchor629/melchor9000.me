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
        sh 'yarn'
      }
    }

    stage('Checks') {
      steps {
        sh 'yarn lint'
        sh 'yarn audit'
      }
    }

    stage('Build') {
      environment {
        REACT_APP_FLICKR_API_KEY = credentials('melchor9000-flickr-api-key')
        REACT_APP_FIREBASE_API_KEY = credentials('melchor9000-firebase-api-key')
        REACT_APP_FIREBASE_AUTH_DOMAIN = credentials('melchor9000-firebase-auth-domain')
        REACT_APP_FIREBASE_DATABASE_URL = credentials('melchor9000-firebase-database-url')
        REACT_APP_FIREBASE_PROJECT_ID = credentials('melchor9000-firebase-project-id')
        REACT_APP_FIREBASE_STORAGE_BUCKET = credentials('melchor9000-firebase-storage-bucket')
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID = credentials('melchor9000-firebase-messaging-sender-id')
        REACT_APP_FIREBASE_APP_ID = credentials('melchor9000-firebase-app-id')
      }

      steps {
        sh 'yarn build'
      }
    }

    stage('Deploy') {
      when {
        branch 'master'
      }

      environment {
        FIREBASE_TOKEN = credentials('melchor9000-firebase-token')
      }

      steps {
        sh 'yarn deploy'
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
