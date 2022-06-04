import {
  AppearanceFaction,
  AssFactionsC,
  BoobsFactionsC,
  data,
  FaceFactionsC,
  LN,
  LV,
} from "database"
import { Actor, Faction, Form, Game, on, once } from "skyrimPlatform"
import { JOURNEY_DAYS } from "maxick_compatibility"

export function main() {
  LN("Successful initialization")
  data.baboFace.forEach((v) => {
    LN(`${v.x}, ${v.y}`)
  })

  on("modEvent", (e) => {
    if (e.eventName === JOURNEY_DAYS) UpdatePerceivedAppearance(e.numArg)
  })

  once("update", () => {
    InitFactions()
    player = Game.getPlayer() as Actor
  })
}

function UpdatePerceivedAppearance(journeyPercent: number) {
  const j = journeyPercent
  LV(`Got journey: ${j}`)
}

type FactionList = (Faction | null)[]
let faceFactions: FactionList = []
let assFactions: FactionList = []
let boobsFactions: FactionList = []

let player: Actor

function InitFactions() {
  const SlaxFactionById = (formID: number) =>
    Faction.from(Game.getFormFromFile(formID, "SexlabAroused.esm"))
  const F = (id: number) => SlaxFactionById(id)

  faceFactions = FaceFactionsC.map(F)
  assFactions = AssFactionsC.map(F)
  boobsFactions = BoobsFactionsC.map(F)
}

function SetAppearanceFaction(factionList: FactionList) {
  return (newFaction: AppearanceFaction): boolean => {
    const nf = factionList[newFaction]
    if (!nf) return false

    const changedFactions = !player.isInFaction(nf)

    factionList.forEach((faction) => {
      if (!faction) return
      player.removeFromFaction(faction)
    })

    // Send event for papyrus because SP doesn't have an `addTofaction` function
    return changedFactions
  }
}
