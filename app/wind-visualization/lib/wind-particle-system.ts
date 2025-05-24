import * as Cesium from "cesium"

export class WindParticleSystem {
  private viewer: Cesium.Viewer
  private windData: any
  private settings: any
  private particles: Particle[] = []
  private primitives: Cesium.PrimitiveCollection
  private streamlines: Cesium.PrimitiveCollection
  private updateCallback: any
  private isDestroyed = false

  constructor(viewer: Cesium.Viewer, windData: any, settings: any) {
    this.viewer = viewer
    this.windData = windData
    this.settings = settings
    this.primitives = new Cesium.PrimitiveCollection()
    this.streamlines = new Cesium.PrimitiveCollection()

    this.viewer.scene.primitives.add(this.primitives)
    this.viewer.scene.primitives.add(this.streamlines)

    this.initializeParticles()
    this.startAnimation()
  }

  private initializeParticles() {
    // Clear existing particles
    this.particles = []
    this.primitives.removeAll()

    // Create new particles
    for (let i = 0; i < this.settings.particleCount; i++) {
      this.particles.push(this.createRandomParticle())
    }

    // Create billboard collection for particles
    const billboardCollection = new Cesium.BillboardCollection({
      scene: this.viewer.scene,
    })

    // Add billboards for each particle
    this.particles.forEach((particle) => {
      particle.billboard = billboardCollection.add({
        position: this.calculatePosition(particle),
        image: this.createParticleImage(),
        scale: this.settings.particleSize,
        color: this.getParticleColor(particle),
        translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.0),
      })
    })

    this.primitives.add(billboardCollection)

    // Create streamlines if enabled
    if (this.settings.showStreamlines) {
      this.createStreamlines()
    }
  }

  private createRandomParticle(): Particle {
    // Random position on the globe
    const lon = Math.random() * 360 - 180
    const lat = Math.random() * 180 - 90

    return {
      lon,
      lat,
      altitude: this.settings.altitude + (Math.random() * 1000 - 500),
      age: Math.random() * 60, // Random initial age
      maxAge: 60 + Math.random() * 30, // Particles live for 60-90 seconds
      billboard: null,
    }
  }

  private calculatePosition(particle: Particle): Cesium.Cartesian3 {
    return Cesium.Cartesian3.fromDegrees(particle.lon, particle.lat, particle.altitude)
  }

  private createParticleImage(): HTMLCanvasElement {
    const canvas = document.createElement("canvas")
    canvas.width = 8
    canvas.height = 8

    const context = canvas.getContext("2d")
    if (!context) return canvas

    // Draw a soft, circular particle
    const gradient = context.createRadialGradient(4, 4, 0, 4, 4, 4)
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

    context.fillStyle = gradient
    context.beginPath()
    context.arc(4, 4, 4, 0, Math.PI * 2)
    context.fill()

    return canvas
  }

  private getParticleColor(particle: Particle): Cesium.Color {
    // Get wind vector at particle position
    const windVector = this.getWindVectorAtPosition(particle.lon, particle.lat)

    if (!windVector) {
      return Cesium.Color.WHITE
    }

    // Color based on selected mode
    switch (this.settings.colorMode) {
      case "speed": {
        // Color based on wind speed
        const speed = windVector.speed * this.settings.speed
        const normalizedSpeed = Math.min(speed / 15, 1) // Normalize to 0-1 range

        // Blue (slow) to cyan to white (fast)
        return Cesium.Color.fromHsl(
          0.6 - normalizedSpeed * 0.2, // Hue: blue to cyan
          1.0,
          0.3 + normalizedSpeed * 0.7, // Lightness: darker to brighter
        )
      }

      case "direction": {
        // Color based on wind direction
        const direction = windVector.direction
        const hue = ((direction + 180) / 360) % 1 // Normalize to 0-1 range
        return Cesium.Color.fromHsl(hue, 1.0, 0.5)
      }

      case "altitude": {
        // Color based on altitude
        const normalizedAltitude = (particle.altitude - 1000) / 49000 // Normalize to 0-1 range
        return Cesium.Color.fromHsl(0.7 - normalizedAltitude * 0.7, 1.0, 0.5)
      }

      case "temperature": {
        // Simulate temperature based on latitude and altitude
        const latFactor = 1 - Math.abs(particle.lat) / 90 // 0 at poles, 1 at equator
        const altFactor = 1 - particle.altitude / 50000 // 1 at sea level, 0 at max altitude
        const temp = latFactor * altFactor

        // Blue (cold) to red (hot)
        return Cesium.Color.fromHsl(0.6 - temp * 0.6, 1.0, 0.5)
      }

      default:
        return Cesium.Color.WHITE
    }
  }

  private getWindVectorAtPosition(lon: number, lat: number) {
    // Find the closest wind vector in our data
    if (!this.windData || !this.windData.vectors) return null

    // Simple approach: find the closest vector
    let closestVector = null
    let minDistance = Number.POSITIVE_INFINITY

    for (const vector of this.windData.vectors) {
      const distance = Math.sqrt(Math.pow(lon - vector.lon, 2) + Math.pow(lat - vector.lat, 2))

      if (distance < minDistance) {
        minDistance = distance
        closestVector = vector
      }
    }

    return closestVector
  }

  private createStreamlines() {
    this.streamlines.removeAll()

    if (!this.settings.showStreamlines || !this.windData || !this.windData.vectors) {
      return
    }

    // Create streamlines from a subset of wind vectors
    const streamlinePoints = []
    const step = 3 // Use every 3rd point to avoid overcrowding

    for (let i = 0; i < this.windData.vectors.length; i += step) {
      const vector = this.windData.vectors[i]

      // Start point
      const startLon = vector.lon
      const startLat = vector.lat

      // Calculate end point based on wind direction and speed
      const speedFactor = vector.speed * this.settings.speed * 0.5
      const endLon = startLon + vector.u / speedFactor
      const endLat = startLat + vector.v / speedFactor

      // Add line if it's not too long (avoid lines crossing the entire globe)
      if (Math.abs(endLon - startLon) < 10 && Math.abs(endLat - startLat) < 10) {
        streamlinePoints.push({
          start: Cesium.Cartesian3.fromDegrees(startLon, startLat, this.settings.altitude),
          end: Cesium.Cartesian3.fromDegrees(endLon, endLat, this.settings.altitude),
          speed: vector.speed,
        })
      }
    }

    // Create polylines for streamlines
    const polylines = new Cesium.PolylineCollection()

    streamlinePoints.forEach((point) => {
      const normalizedSpeed = Math.min(point.speed / 15, 1)
      const color = Cesium.Color.fromHsl(
        0.6 - normalizedSpeed * 0.2,
        1.0,
        0.5,
        0.3, // Semi-transparent
      )

      polylines.add({
        positions: [point.start, point.end],
        width: 1.5,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.2,
          color: color,
        }),
      })
    })

    this.streamlines.add(polylines)
  }

  private startAnimation() {
    // Update particles on each frame
    this.updateCallback = this.viewer.scene.preUpdate.addEventListener(() => {
      if (this.isDestroyed) return

      const deltaTime = 0.016 // Assume ~60fps

      this.particles.forEach((particle) => {
        // Update particle age
        particle.age += deltaTime

        // Reset particles that have exceeded their lifetime
        if (particle.age > particle.maxAge) {
          const newParticle = this.createRandomParticle()
          particle.lon = newParticle.lon
          particle.lat = newParticle.lat
          particle.altitude = newParticle.altitude
          particle.age = 0
        } else {
          // Move particle based on wind vector
          const windVector = this.getWindVectorAtPosition(particle.lon, particle.lat)

          if (windVector) {
            // Apply wind velocity to particle position
            particle.lon += windVector.u * this.settings.speed * deltaTime * 0.01
            particle.lat += windVector.v * this.settings.speed * deltaTime * 0.01

            // Wrap around the globe if needed
            if (particle.lon > 180) particle.lon -= 360
            if (particle.lon < -180) particle.lon += 360

            // Clamp latitude to avoid particles at the poles
            particle.lat = Math.max(-85, Math.min(85, particle.lat))
          }
        }

        // Update particle position and color
        if (particle.billboard) {
          particle.billboard.position = this.calculatePosition(particle)
          particle.billboard.color = this.getParticleColor(particle)
        }
      })
    })
  }

  public updateSettings(newSettings: any) {
    const needsReinitialize =
      this.settings.particleCount !== newSettings.particleCount ||
      this.settings.showStreamlines !== newSettings.showStreamlines ||
      this.settings.altitude !== newSettings.altitude

    this.settings = { ...this.settings, ...newSettings }

    // Update particle size without reinitializing
    if (!needsReinitialize) {
      this.primitives.forEach((primitive) => {
        if (primitive instanceof Cesium.BillboardCollection) {
          for (let i = 0; i < primitive.length; i++) {
            primitive.get(i).scale = this.settings.particleSize
            primitive.get(i).color = this.getParticleColor(this.particles[i])
          }
        }
      })

      // Update streamlines if they're enabled
      if (this.settings.showStreamlines) {
        this.createStreamlines()
      } else {
        this.streamlines.removeAll()
      }
    } else {
      // Reinitialize particles if count or altitude changed
      this.initializeParticles()
    }
  }

  public destroy() {
    this.isDestroyed = true

    if (this.updateCallback) {
      this.updateCallback()
    }

    if (this.viewer && !this.viewer.isDestroyed()) {
      this.viewer.scene.primitives.remove(this.primitives)
      this.viewer.scene.primitives.remove(this.streamlines)
    }

    this.particles = []
  }
}

interface Particle {
  lon: number
  lat: number
  altitude: number
  age: number
  maxAge: number
  billboard: Cesium.Billboard | null
}
