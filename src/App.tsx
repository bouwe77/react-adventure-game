import { ReactElement, useEffect, useState } from 'react'

type Id = string

type LocationId = Id

type DestinationId = Id

type Destination = {
  id: Id
  name: string
  toLocation: string
}

type Action = {
  title: string
}

type Inventory = {
  name: string
}

type Location = {
  id: Id
  name: string
  text: ReactElement
  destinations: Destination[]
  actions?: Action[]
}

const game: Location[] = [
  {
    id: '1d3ew4',
    name: 'outside',
    text: (
      <>
        <p>
          You are standing in a beautiful field with waving grass, and some
          trees.
        </p>
        <p>
          To the NORTH you see a beautiful castle. But wait, what's that? From
          the castle you here someone screaming!
        </p>
        <p> "HELP!!! Please help me. I am locked up in here!"</p>
        <p>To the WEST you see a beautiful, big oak tree.</p>
      </>
    ),
    destinations: [
      { id: 'f3tpqj', name: 'To the castle', toLocation: 'dkj32d' },
      { id: 'rny8ky', name: 'To the tree', toLocation: '03kjfr' },
    ],
  },
  {
    id: 'dkj32d',
    name: 'castle',
    text: (
      <>
        <p>You arrived at the castle.</p>
        <p>There is a big, heavy door in front of you. It's closed.</p>
      </>
    ),
    destinations: [
      { id: '2rgfwx', name: 'To the field', toLocation: '1d3ew4' },
    ],
    //actions: [{ title: 'Open the door' }],
  },
  {
    id: '03kjfr',
    name: 'tree',
    text: (
      <>
        <p>
          You approach the tree. But wait, what's that hidden in the long grass
          next to the tree?
        </p>
        <p>It's a small chest! And it's closed.</p>
      </>
    ),
    destinations: [
      { id: 'udx25c', name: 'To the field', toLocation: '1d3ew4' },
    ],
    //actions: [{ title: 'Open the chest' }],
  },
]

const goToLocation = (
  fromLocation: LocationId,
  toDestination: DestinationId,
) => {
  const destination = game
    .find((s) => s.id === fromLocation)
    ?.destinations.find((d) => d.id === toDestination)

  if (!destination) throw new Error('Unknown destination')

  const location = game.find((s) => s.id === destination.toLocation)

  if (!location)
    throw new Error(`Unknown locationId: ${destination.toLocation}`)

  return Promise.resolve(location)
}

const getCurrentLocation = async () => {
  return Promise.resolve(game[0])
}

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<Location>()
  const [holding, setHolding] = useState<Inventory[]>([])
  const [carrying, setCarrying] = useState<Inventory[]>([])

  useEffect(() => {
    getCurrentLocation().then((location) => setCurrentLocation(location))
  }, [])

  const goToDestination = async (destinationId: string) => {
    if (!currentLocation) return
    const newLocation = await goToLocation(currentLocation.id, destinationId)
    setCurrentLocation(newLocation)
  }

  if (!currentLocation) return null

  return (
    <div className="App">
      <h1>The Adventures of a Great Hero</h1>

      <div>
        <div>{currentLocation.text}</div>

        <div>
          <h2>Directions</h2>
          {currentLocation.destinations.map((destination) => (
            <button
              key={destination.id}
              onClick={() => goToDestination(destination.id)}
            >
              {destination.name}
            </button>
          ))}
        </div>

        {currentLocation.actions ? (
          <div>
            <h2>You can also see</h2>
            {currentLocation.actions?.map((action) => (
              <button key={action.title}>{action.title}</button>
            ))}
          </div>
        ) : null}

        {holding.length > 0 ? (
          <div>
            <h2>You are holding</h2>
            <ul>
              {holding.map((inventory) => (
                <li key={inventory.name}>{inventory.name}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {carrying.length > 0 ? (
          <div>
            <h2>You are carrying</h2>
            <ul>
              {carrying.map((inventory) => (
                <li key={inventory.name}>{inventory.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}
