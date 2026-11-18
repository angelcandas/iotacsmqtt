# iotacsmqtt

MQTT broker for [IoTACS](https://github.com/angelcandas/iotacs), an IoT device dashboard I built in 2018. Archived portfolio project.

- [Mosca](https://github.com/moscajs/mosca) broker served over WebSockets, so browsers and devices share one endpoint
- Every connecting client is authenticated against the [IoTACS API](https://github.com/angelcandas/iotacsback)
- Publishes are only accepted when the payload's device token belongs to the user named in the topic

See the [iotacs README](https://github.com/angelcandas/iotacs#how-it-works) for how the pieces fit together.
