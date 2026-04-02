J'ai trouvé l'ultime coupable !! 🕵️‍♂️\n\nJ'ai écrit un script pour tester directement l'API DexPay et j'ai découvert que le serveur DexPay interdit formellement la présence du mot localhost ou 127.0.0.1 dans les URLs (success_url, webhook_url).\nSi l'API voit "localhost", elle rejette immédiatement la transaction avec le code 422 Validation Failed !\n\nPuisque vous développez en local (APP_URL=<http://localhost:8000>), le serveur renvoyait 422.\n\nLa solution :\nJ'ai ajouté un "Workaround" local. Si le code détecte que vous êtes sur localhost, il remplace temporairement le domaine par <https://tailleurapp.com> uniquement pour tromper la validation de DexPay. Le bouton S'abonner va maintenant générer le lien de paiement avec succès !\n\nATTENTION : Quand vous paierez en mode sandbox, DexPay vous redirigera vers <https://tailleurapp.com/api/v2/>... à la fin. Puisque le site n'existe pas, vous aurez une erreur sur votre navigateur. Il vous suffira de remplacer <https://tailleurapp.com> par <http://localhost:8000> ou <http://localhost:5173> dans la barre d'adresse pour finaliser ! (Ceci n'arrivera pas en production).\n\nVous pouvez cliquer sur S'abonner maintenant, cela fonctionne !



push work only with local host



$user = App\Models\User::where('phone', '774731493')->first(); 
 $user->notify(new App\Notifications\MultiChannelNotification(  
'Notification Magique ',  
'Bravo ! Votre système de notifications Push PWA fonctionne à merveille sur Tailleur App !', 
'general',  
'http:/localhost:5173/settings'                                                                                                   )); 