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

    // Show us the notification payload if the app is open on our device
    window.PushNotifications.addListener('pushNotificationReceived', 
        notification => {
            if(notification.data.url && !/^http:\/\//.test(notification.data.url)){
               this.alert(notification.title, notification.body, 'Go', () => {
                 this.$router.push(notification.data.url);
               });
            }
        }
    );

    // Method called when tapping on a notification
    window.PushNotifications.addListener('pushNotificationActionPerformed', 
      notification => {
        if(notification.data.url && !/^http:\/\//.test(notification.data.url)){
          this.$router.psuh(notification.data.url);
        }
      }
    );

    window.PLocalNotifications.addListener('pushNotificationReceived', 
        () => {
          window.dispatchEvent(new Event('notifiaction'));
          this.$router.push("/app/sheduler");
        }
    );

    // Method called when tapping on a notification
    window.PLocalNotifications.addListener('pushNotificationActionPerformed', 
      () => {
        window.dispatchEvent(new Event('notifiaction'));
        this.$router.push("/app/sheduler");
      }
    );

    const date = new Date();
    if(date.getHours() == 10 && date.getMinutes() == 0){
      setTimeout(() => {
        window.LocalNotifications.schedule({
          title: 'Guess what series are broadcast today',
          text: `To see the series that will be broadcast today \n
click on the notification and when the app starts \n
click the today button on the app tab`,
          trigger: { every: {hour: 10, minute: 0}, count: 1}
        });
      }, 64000)
    }else{
      window.LocalNotifications.schedule({
        title: 'Guess what series are broadcast today',
        text: `To see the series that will be broadcast today \n
click on the notification and when the app starts \n
click the today button on the app tab`,
        trigger: { every: {hour: 10, minute: 0}, count: 1}
      });
    }
    
  },
}
</script>

