class TestFisico {
  constructor({
    id,
    judoka_id,
    mesociclo_id,
    fecha_registro,
    peso_corporal,

    press_1rm, press_tiempo, press_recorrido, press_vo2,
    tiron_1rm, tiron_tiempo, tiron_recorrido, tiron_vo2,
    sentadilla_1rm, sentadilla_tiempo, sentadilla_recorrido, sentadilla_vo2,
    barra_reps, barra_tiempo, barra_recorrido, barra_vo2,
    paralelas_reps, paralelas_tiempo, paralelas_recorrido, paralelas_vo2,
    mil500_segundos, mil500_velocidad, mil500_vo2,
    navette_palier, navette_velocidad, navette_vo2,

    created_at,
    updated_at
  }) {
    this.id = id
    this.judoka_id = judoka_id
    this.mesociclo_id = mesociclo_id
    this.fecha_registro = fecha_registro
    this.peso_corporal = peso_corporal

    this.press_1rm = press_1rm
    this.press_tiempo = press_tiempo
    this.press_recorrido = press_recorrido
    this.press_vo2 = press_vo2

    this.tiron_1rm = tiron_1rm
    this.tiron_tiempo = tiron_tiempo
    this.tiron_recorrido = tiron_recorrido
    this.tiron_vo2 = tiron_vo2

    this.sentadilla_1rm = sentadilla_1rm
    this.sentadilla_tiempo = sentadilla_tiempo
    this.sentadilla_recorrido = sentadilla_recorrido
    this.sentadilla_vo2 = sentadilla_vo2

    this.barra_reps = barra_reps
    this.barra_tiempo = barra_tiempo
    this.barra_recorrido = barra_recorrido
    this.barra_vo2 = barra_vo2

    this.paralelas_reps = paralelas_reps
    this.paralelas_tiempo = paralelas_tiempo
    this.paralelas_recorrido = paralelas_recorrido
    this.paralelas_vo2 = paralelas_vo2

    this.mil500_segundos = mil500_segundos
    this.mil500_velocidad = mil500_velocidad
    this.mil500_vo2 = mil500_vo2

    this.navette_palier = navette_palier
    this.navette_velocidad = navette_velocidad
    this.navette_vo2 = navette_vo2

    this.created_at = created_at
    this.updated_at = updated_at
  }
}

module.exports = TestFisico
