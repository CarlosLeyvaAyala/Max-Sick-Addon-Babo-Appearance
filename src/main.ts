import {
  AppearanceFaction,
  Ass,
  AssFactions,
  AssFactionsC,
  Boobs,
  BoobsFactions,
  BoobsFactionsC,
  Face,
  FaceFactions,
  FaceFactionsC,
  LI,
  LN,
  LV,
  LVT,
} from "database"
import { MathLib } from "Dmlib"
import { JOURNEY_DAYS } from "maxick_compatibility"
import { Actor, Debug, Faction, Game, on } from "skyrimPlatform"

export function main() {
  LN("Successful initialization")

  on("modEvent", (e) => {
    if (e.eventName === JOURNEY_DAYS) UpdatePerceivedAppearance(e.numArg)
    if (e.eventName === "Maxick_OnGameReloaded") LV("Game reloaded from Maxick")
  })
}

const YToFaceFaction = (x: number) =>
  x < 19
    ? FaceFactions.ugly
    : x < 40
    ? FaceFactions.plain
    : x < 60
    ? FaceFactions.average
    : x < 80
    ? FaceFactions.pretty
    : FaceFactions.beautiful

const YToAssFaction = (x: number) =>
  x < 30
    ? AssFactions.tiny
    : x < 50
    ? AssFactions.nice
    : x < 80
    ? AssFactions.big
    : AssFactions.amazing

const YToBoobsFaction = (x: number) =>
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
  LV("-----------------------------")
  LV(`Got journey: ${journeyPercent}`)
  LV("-----------------------------")
  const j = MathLib.ForcePercent(journeyPercent)

  LV(`Setting up face`)
  SetFaction(
    Face(j) * 100,
    FaceFactionsC,
    YToFaceFaction,
    (v) => "Your face is now " + FaceFactions[v]
  )

  LV(`Setting up ass`)
  SetFaction(
    Ass(j) * 100,
    AssFactionsC,
    YToAssFaction,
    (v) => "Your ass now looks " + AssFactions[v]
  )

  LV(`Setting up boobs`)
  SetFaction(
    Boobs(j) * 120,
    BoobsFactionsC,
    YToBoobsFaction,
    (v) => "Your boobs now look " + BoobsFactions[v]
  )
}

function SetFaction(
  y: number,
  factionList: FactionList,
  valToFaction: (x: number) => AppearanceFaction,
  changedMsg: (v: AppearanceFaction) => string
) {
  const newFaction = valToFaction(LVT("Got <y> appearance", y))
  LV(`New faction ${newFaction}`)
  const changed = SetAppearanceFaction(factionList)(newFaction)
  if (changed) {
    const m = changedMsg(newFaction)
    Debug.messageBox(m)
    LI(m)
  }
}

type FactionList = number[]

const player = () => Actor.from(Game.getPlayer())

function SetAppearanceFaction(factionList: FactionList) {
  return (newFaction: AppearanceFaction): boolean => {
    const nf = LVT("Intended faction", factionList[newFaction])
    const Slax = (id: number) =>
      Faction.from(Game.getFormFromFile(id, "SexlabAroused.esm"))
    const newF = () => Slax(nf)
    if (!newF) return false
    LV(`Got faction: ${newF()?.getName()}`)

    const changedFactions = !player()?.isInFaction(newF())
    if (!changedFactions) {
      LV(`No need to change faction.`)
      return false
    }

    LV(`There was a faction change.`)
    factionList.forEach((faction) => {
      if (!faction) return
      player()?.removeFromFaction(Slax(faction))
    })

    // Send event for papyrus because SP doesn't have an `addTofaction` function.
    // To avoid adding yet another esp file, setting the player faction is done in
    // Maxick_Main.psc in https://github.com/CarlosLeyvaAyala/Max-Sick-Gains
    // This is dirty and not really good, but meh... I'm the one developing both
    // files anyway.
    player()?.sendModEvent("MaxickAppearanceFaction", "", nf)
    LV(`New faction was sent to Papyrus: ${newF()?.getName()}`)

    return changedFactions
  }
}
