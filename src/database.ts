import { DebugLib, MathLib } from "Dmlib"
import { settings } from "skyrimPlatform"

/** Data exported from _Max Sick Gains.exe_. */
export interface BaboData {
  logging: LoggingCfg
  /** Face spline. */
  baboFace: MathLib.Point[]
  /** Ass spline. */
  baboAss: MathLib.Point[]
  /** Boobs spline. */
  baboBoobs: MathLib.Point[]
}

export interface LoggingCfg {
  level: number
  toConsole: boolean
  toFile: boolean
}

const modName = "maxick-addon-babo"
const displayName = "Maxick_Addon_Babo"

/** All data needed for this mod to work. */
//@ts-ignore
export const data: BaboData = settings[modName]
const logLvl = DebugLib.Log.LevelFromValue(data.logging.level)

const d = DebugLib.Log.CreateAll(
  displayName,
  logLvl,
  data.logging.toConsole ? DebugLib.Log.ConsoleFmt : undefined,
  data.logging.toFile ? DebugLib.Log.FileFmt : undefined
)

export const LN = d.None
export const LV = d.Verbose
export const LI = d.Info
export const LIT = d.TapI
export const LVT = d.TapV

/** Function to calculate face appearance. */
export const Face = MathLib.CubicSpline(data.baboFace)
/** Function to calculate ass appearance. */
export const Ass = MathLib.CubicSpline(data.baboAss)
/** Function to calculate boobs appearance. */
export const Boobs = MathLib.CubicSpline(data.baboBoobs)

export enum FaceFactions {
  none,
  ugly,
  plain,
  average,
  pretty,
  beautiful,
}

export const FaceFactionsC = [
  0, // none
  0x08f8d9, // ugly
  0x08f8da, // plain
  0x08f8db, // average
  0x08f8dc, // pretty
  0x08f8dd, // beautiful
]

export enum AssFactions {
  none,
  tiny,
  nice,
  big,
  amazing,
}

export const AssFactionsC = [
  0, // none
  0x08f8d5, // tiny
  0x08f8d6, // nice
  0x08f8d8, // big
  0x08f8d7, // amazing
]

export enum BoobsFactions {
  none,
  tiny,
  nice,
  big,
  full,
  amazing,
  enormous,
}

export const BoobsFactionsC = [
  0, // none
  0x08f8d4, // tiny
  0x08f8cc, // nice
  0x08f8ce, // big
  0x08f8d8, // full
  0x08f8cf, // amazing
  0x08f8d0, // enormous
]

export type AppearanceFaction = FaceFactions | AssFactions | BoobsFactions
