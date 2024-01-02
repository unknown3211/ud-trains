declare function SwitchTrainTrack(trackId: number, state: boolean): void;
declare function SetTrainTrackSpawnFrequency(trackId: number, frequency: number): void;
declare function SetRandomTrains(state: boolean): void;
declare function SetTrainsForceDoorsOpen(state: boolean): void;
declare function PlayerPedId(): number;
declare function GetEntityCoords(entity: number): Vector3;
declare function IsPedInAnyTrain(ped: number): boolean;
declare function GetTrainCurrentTrackNode(train: number): number;
declare function GetGamePool(poolName: string): any[];
declare function GetDistanceBetweenCoords(coords1: Vector3, coords2: Vector3, useZ: boolean): number;
declare function GetEntityModel(entity: number): number;
declare function GetHashKey(modelName: string): number;
declare function GetEntitySpeed(entity: number): number;

type TrainStation = {
    node: number;
    name: string;
};

type Vector3 = {
    x: number;
    y: number;
    z: number;
};

const stations: TrainStation[] = [
    { node: 179, name: "Strawberry" },
	{ node: 271,  name: "Puerto Del Sol" },
    { node: 388,  name: "LSIA Parking" },
    { node: 434,  name: "LSIA Terminal 4" },
    { node: 530,  name: "LSIA Terminal 4" },
    { node: 578,  name: "LSIA Parking" },
    { node: 689,  name: "Puerto Del Sol" },
    { node: 782,  name: "Strawberry" },
    { node: 1078, name: "Burton" },
    { node: 1162, name: "Portola Drive" },
    { node: 1233, name: "Del Perro" },
    { node: 1331, name: "Little Seoul" },
    { node: 1397, name: "Pillbox South" },
    { node: 1522, name: "Davis" },
    { node: 1649, name: "Davis" },
    { node: 1791, name: "Pillbox South" },
    { node: 1869, name: "Little Seoul" },
    { node: 1977, name: "Del Perro" },
    { node: 2066, name: "Portola Drive" },
    { node: 2153, name: "Burton" },
    { node: 2246, name: "Strawberry" }
];

let trains: any[] = [];
let InTrain: boolean = false;
let currentNode: number | null = null;

function initTrainSystem(): void {
    SwitchTrainTrack(0, true);
    SwitchTrainTrack(3, true);

    SetTrainTrackSpawnFrequency(0, 120000);
    SetRandomTrains(true);

    SetTrainsForceDoorsOpen(false);
}

async function mainLoop(): Promise<void> {
    while (true) {
        await delay(1000);

        const player = PlayerPedId();
        const coords = GetEntityCoords(player);

        trains = getTrains(coords);

        if (trains.length >= 1) {
            const train = trains[0].vehicle;

            currentNode = train ? GetTrainCurrentTrackNode(train) : null;
        }

        InTrain = IsPedInAnyTrain(player);
    }
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getTrains(coords: Vector3): any[] {
    const TrainSystem: any[] = [];

    const vehiclePool = GetGamePool("CVehicle");
    for (const vehicle of vehiclePool) {
        const vehicleCoords = GetEntityCoords(vehicle);
        const distance = GetDistanceBetweenCoords(vehicleCoords, coords, true);

        if (distance <= 100 && GetEntityModel(vehicle) === GetHashKey("metrotrain")) {
            TrainSystem.push({ vehicle, distance, speed: GetEntitySpeed(vehicle) });
        }
    }

    return TrainSystem.sort((a, b) => a.distance - b.distance);
}

initTrainSystem();
mainLoop();