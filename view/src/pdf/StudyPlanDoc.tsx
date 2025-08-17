import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { StudyPlan, RecommendationItem } from "../lib/studyPlan";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  h1: { fontSize: 18, marginBottom: 8, fontWeight: 700 },
  h2: { fontSize: 14, marginTop: 12, marginBottom: 6, fontWeight: 700 },
  p: { marginBottom: 4 },
  box: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, padding: 8, marginBottom: 8 },
  muted: { color: "#666" },
  row: { display: "flex", flexDirection: "row", justifyContent: "space-between" },
  li: { marginLeft: 10, marginBottom: 2 },
});

export type Profile = {
  role: string;
  seniority: "junior" | "pleno" | "senior";
  targetArea?: string;
  goals?: string[];
  budgetUSD?: number;
};

type Props = {
  profile: Profile;
  items: RecommendationItem[];
  plan: StudyPlan;
};

export default function StudyPlanDoc({ profile, items, plan }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Plano de Estudos — CareerPath</Text>

        <View style={styles.box}>
          <Text style={styles.h2}>Perfil</Text>
          <Text style={styles.p}>Cargo: {profile.role} • Senioridade: {profile.seniority}</Text>
          {profile.targetArea ? <Text style={styles.p}>Área-alvo: {profile.targetArea}</Text> : null}
          {profile.goals?.length ? (
            <Text style={styles.p}>Metas: {profile.goals.join(", ")}</Text>
          ) : null}
          {typeof profile.budgetUSD === "number" ? (
            <Text style={styles.p}>Orçamento: ${profile.budgetUSD}</Text>
          ) : null}
        </View>

        <View style={styles.box}>
          <Text style={styles.h2}>Recomendações (ordem sugerida)</Text>
          {plan.suggestionOrder.map((id, idx) => {
            const it = items.find((i) => i.certification.id === id)!;
            return (
              <View key={id} style={{ marginBottom: 6 }}>
                <Text>
                  {idx + 1}. {it.certification.name} — {it.certification.provider}
                  {it.certification.area ? ` • ${it.certification.area}` : ""} • {it.certification.level}
                </Text>
                {it.reasons?.length ? (
                  <View style={{ marginTop: 2 }}>
                    {it.reasons.map((r, i) => (
                      <Text key={i} style={styles.li}>• {r}</Text>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.box}>
          <Text style={styles.h2}>Plano por Certificação</Text>
          {plan.suggestionOrder.map((id, idx) => {
            const it = items.find((i) => i.certification.id === id)!;
            const name = it.certification.name;
            const weeksForCert = plan.weeks.filter((w) => w.title.startsWith(`${name} — Semana`));
            const totalHrs = weeksForCert.reduce((sum, w) => sum + (w.estimateHrs || 0), 0);
            const totalWeeks = weeksForCert.length;
            return (
              <View key={id} style={{ marginBottom: 8 }}>
                <Text style={{ fontWeight: 700 }}>
                  {idx + 1}. {name} — {it.certification.provider}
                  {it.certification.area ? ` • ${it.certification.area}` : ""} • {it.certification.level}
                </Text>
                <Text style={[styles.p, styles.muted]}>Carga estimada: {totalHrs}h ({totalWeeks} semanas)</Text>
                {weeksForCert.length ? (
                  <View>
                    {weeksForCert.map((w, wi) => (
                      <Text key={wi} style={styles.li}>• {w.title.replace(`${name} — `, "")}: ~{w.estimateHrs}h</Text>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <Text style={[styles.p, styles.muted]}>Gerado por CareerPath — {new Date().toLocaleDateString()}</Text>
      </Page>
    </Document>
  );
}
