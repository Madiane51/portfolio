export default async function handler(req, res) {
  // On n'accepte que les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // On récupère l'URL secrète du webhook depuis les variables d'environnement
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("Erreur : La variable DISCORD_WEBHOOK_URL n'est pas définie.");
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // On renvoie les données reçues par le frontend (le body) directement à Discord
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!discordResponse.ok) {
      throw new Error(`Discord API error: ${discordResponse.status}`);
    }

    // On dit au frontend que tout s'est bien passé
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Erreur lors de l'envoi à Discord :", error);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
}
