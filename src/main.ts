import {
  AppearanceFaction,
  AssFactions,
  AssFactionsC,
  BoobsFactions,
  BoobsFactionsC,
  data,
  Face,
  FaceFactions,
  FaceFactionsC,
  LN,
  LV,
} from "database"
import { Actor, Debug, Faction, Form, Game, on, once } from "skyrimPlatform"
import { JOURNEY_DAYS } from "maxick_compatibility"
import { MathLib } from "Dmlib"

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

const XToFaceFaction = (x: number) =>
  x < 19
    ? FaceFactions.ugly
    : x < 40
    ? FaceFactions.plain
    : x < 60
    ? FaceFactions.average
    : x < 80
    ? FaceFactions.pretty
    : FaceFactions.beautiful

const XToAssFaction = (x: number) =>
  x < 30
    ? AssFactions.tiny
    : x < 50
    ? AssFactions.nice
    : x < 80
    ? AssFactions.big
    : AssFactions.amazing

const XToBoobsFaction = (x: number) =>
  x < 30
    ? BoobsFactions.tiny
    : x < 50
    ? BoobsFactions.nice
    : x < 70
    ? BoobsFactions.big
    : x < 90
    ? BoobsFactions.full
    : x < 101
    ? BoobsFactions.amazing
    : BoobsFactions.enormous

function UpdatePerceivedAppearance(journeyPercent: number) {
  LV(`Got journey: ${journeyPercent}`)
  const j = MathLib.ForcePercent(journeyPercent)
  SetFaction(
    faceFactions,
    j,
    100,
    XToFaceFaction,
    (v) => "Your face is now " + FaceFactions[v]
  )
  SetFaction(
    assFactions,
    j,
    100,
    XToAssFaction,
    (v) => "Your ass now looks " + AssFactions[v]
  )
  SetFaction(
    boobsFactions,
    j,
    120,
    XToBoobsFaction,
    (v) => "Your boobs now look " + BoobsFactions[v]
  )
}

function SetFaction(
  factionList: FactionList,
  journeyPercent: number,
  maxValue: number,
  valToFaction: (x: number) => AppearanceFaction,
  changedMsg: (v: AppearanceFaction) => string
) {
  const x = journeyPercent * maxValue
  const newFaction = valToFaction(x)
  const changed = SetAppearanceFaction(factionList)(newFaction)
  if (changed) Debug.notification(changedMsg(newFaction))
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
    player.sendModEvent("MaxickAppearanceFaction", "", nf.getFormID())
    return changedFactions
  }
}
