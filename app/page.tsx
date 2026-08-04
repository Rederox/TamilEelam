import SiteHeader from '@/components/vigil/SiteHeader'
import ProgressRail from '@/components/vigil/ProgressRail'
import Lamp from '@/components/vigil/Lamp'
import FlameLayer from '@/components/vigil/gl/FlameLayer'
import Prologue from '@/components/vigil/Prologue'
import ChTerre from '@/components/vigil/ChTerre'
import ChEtau from '@/components/vigil/ChEtau'
import ChFeu from '@/components/vigil/ChFeu'
import ChPromesse from '@/components/vigil/ChPromesse'
import ChJuillet from '@/components/vigil/ChJuillet'
import ChMullivaikkal from '@/components/vigil/ChMullivaikkal'
import ChPatrie from '@/components/vigil/ChPatrie'
import ChSymboles from '@/components/vigil/ChSymboles'
import ChAube from '@/components/vigil/ChAube'
import Epilogue from '@/components/vigil/Epilogue'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <ProgressRail />
      {/* the reader carries the lamp; the vignette is the dark beyond its reach */}
      <Lamp />
      {/* every flame on the page, drawn by one shader */}
      <FlameLayer />
      <div aria-hidden="true" className="vignette pointer-events-none fixed inset-0 z-[86]" />
      <main>
        <Prologue />
        <ChTerre />
        <ChEtau />
        <ChFeu />
        <ChPromesse />
        <ChJuillet />
        <ChMullivaikkal />
        <ChPatrie />
        <ChSymboles />
        <ChAube />
        <Epilogue />
      </main>
    </>
  )
}
