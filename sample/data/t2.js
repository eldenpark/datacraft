this.ticks = notes[0].getIntrinsicTicks();

if (this.ticks >= Vex.Flow.durationToTicks("4")) {
  throw new Vex.RuntimeError("BadArguments",
      "Beams can only be applied to notes shorter than a quarter note.");
}