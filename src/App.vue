<template>
  <div id="app">
    <ion-app>
        <ion-vue-router :animated="false"></ion-vue-router>
        {{ !network ? offlineAlert() : ''}}
    </ion-app>
  </div>
</template>

<script>
export default{
  name: 'app',
  data() {
    return {
      network : true,
    }
  },
  methods:{
    offlineAlert() {
      return this.$ionic.alertController
        .create({
          header: 'You are Offline',
          message: 'This app only works with a internet connection',
          buttons: [
            {
              text: 'Reload',
              role: 'accept',
              cssClass: 'secondary',
              handler: () => {
                window.location.reload();
              }
            },
          ],
        })
        .then(a => a.present())
    },
    alert(header, message, text, handler){
      return this.$ionic.alertController
        .create({
          header,
          message,
          buttons: [
            {
              text : 'Stay here',
              role: 'accept',
              cssClass: 'secondary',
            },
            {
              text,
              role: 'accept',
              cssClass: 'secondary',
              handler,
            },
          ],
        })
        .then(a => a.present())
    }
  },
  created(){
    window.CapNetwork.getStatus().then(res =>  this.network = res.connected);

    window.CapNetwork.addListener('networkStatusChange', status => {
      this.network = status.connected
    });

    window.LocalNotifications.addListener('localNotificationActionPerformed', obj => {
      this.$router.push(obj.notification.extra);
    })

    window.LocalNotifications.schedule({
      notifications : [{
        title: 'Guess what series are broadcast today.',
        body: '',
        id: 1,
        schedule : {
          // repeats : true,
          on : {
            hour : 20,
            minute : 0
          },
        },
        sound: null,
        attachments: null,
        actionTypeId: "", //route to push
        extra: "/app/sheduler"
      }]
    })
    
  },
  mounted(){
    setTimeout(() => {window.SplashScreen.hide()}, 1000);
  }
}
</script>

