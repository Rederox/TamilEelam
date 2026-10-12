import SiteHeader from '@/components/vigil/SiteHeader'
import ProgressRail from '@/components/vigil/ProgressRail'
import Lamp from '@/components/vigil/Lamp'
import Ordeal from '@/components/vigil/Ordeal'
import Resume from '@/components/vigil/Resume'
import FlameLayer from '@/components/vigil/gl/FlameLayer'
import AtmosphereStage from '@/components/vigil/gl/AtmosphereStage'
import GlDust from '@/components/vigil/gl/GlDust'
import Prologue from '@/components/vigil/Prologue'
import ChTerre from '@/components/vigil/ChTerre'
import ChEtau from '@/components/vigil/ChEtau'
import ChFeu from '@/components/vigil/ChFeu'
import ChPromesse from '@/components/vigil/ChPromesse'
import ChPrabhakaran from '@/components/vigil/ChPrabhakaran'
import ChMaaveerar from '@/components/vigil/ChMaaveerar'
import ChJuillet from '@/components/vigil/ChJuillet'
import ChMullivaikkal from '@/components/vigil/ChMullivaikkal'
import ReadingControls from '@/components/vigil/ReadingControls'
import ChDisparus from '@/components/vigil/ChDisparus'
import ChPatrie from '@/components/vigil/ChPatrie'
import ChSymboles from '@/components/vigil/ChSymboles'
import ChAube from '@/components/vigil/ChAube'
import Epilogue from '@/components/vigil/Epilogue'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <ProgressRail />
      {/* a reader who was here before is offered their place back, never moved */}
      <Resume />
      {/* the reader carries the lamp; the vignette is the dark beyond its reach */}
      <Lamp />
      {/* dust hanging in the room, seen only where the lamp finds it */}
      <GlDust intensity={0.9} />
      {/* every flame on the page, drawn by one shader */}
      <FlameLayer />
      {/* the air in every chapter, drawn by one more */}
      <AtmosphereStage />
      {/* how heavy the chapter under the reader is right now */}
      <Ordeal />
      <div aria-hidden="true" className="vignette pointer-events-none fixed inset-0 z-[86]" />
      <main>
        <Prologue />
        <ReadingControls />
        <ChTerre />
        <ChEtau />
        <ChFeu />
        <ChPromesse />
        <ChJuillet />
        <ChPrabhakaran />
        <ChMullivaikkal />
        <ChDisparus />
        <ChPatrie />
        <ChSymboles />
        <ChMaaveerar />
        <ChAube />
        <Epilogue />
      </main>
    </>
  )
}
