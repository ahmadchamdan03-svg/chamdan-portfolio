import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Education, Experience, Project, Skill } from "@/types/database";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1c1917",
    backgroundColor: "#ffffff",
    lineHeight: 1.4,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#047857",
    paddingBottom: 14,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#064e3b",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 10,
    color: "#b45309",
    marginTop: 3,
    fontWeight: "bold",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    fontSize: 8,
    color: "#57534e",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#064e3b",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
    paddingBottom: 3,
    marginTop: 12,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  itemBlock: {
    marginBottom: 6,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1c1917",
  },
  itemPeriod: {
    fontSize: 8,
    color: "#78716c",
  },
  itemSubtitle: {
    fontSize: 8,
    color: "#047857",
    fontWeight: "bold",
    marginTop: 1,
  },
  itemDesc: {
    fontSize: 8,
    color: "#44403c",
    marginTop: 2,
    lineHeight: 1.3,
  },
  bulletList: {
    marginTop: 2,
    paddingLeft: 6,
  },
  bulletItem: {
    fontSize: 8,
    color: "#44403c",
    marginBottom: 1.5,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillBadge: {
    backgroundColor: "#f5f5f4",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontSize: 7.5,
    color: "#1c1917",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: "#a8a29e",
  },
});

interface CVDocumentProps {
  profile?: {
    name: string;
    tagline: string;
    about: string;
  };
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  skills?: Skill[];
}

export default function CVDocument({
  profile,
  education = [],
  experience = [],
  projects = [],
  skills = [],
}: CVDocumentProps) {
  return (
    <Document title="Curriculum Vitae - Ahmad Chamdan Yuwafin" author="Ahmad Chamdan Yuwafin">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>AHMAD CHAMDAN YUWAFIN</Text>
          <Text style={styles.title}>
            Santri Lirboyo, Khadimul Ilmi &amp; AI-Driven Full-Stack Web Developer
          </Text>
          <View style={styles.contactRow}>
            <Text>Kediri, Jawa Timur, Indonesia</Text>
            <Text>Email: ahmadchamdan03@gmail.com</Text>
            <Text>WhatsApp: 0858-9915-1685</Text>
            <Text>Website: https://www.chamdan.site</Text>
            <Text>GitHub: @ahmadchamdan03-svg</Text>
          </View>
        </View>

        {/* Profil Ringkas */}
        <View>
          <Text style={styles.sectionTitle}>Ringkasan Profil</Text>
          <Text style={styles.itemDesc}>
            {profile?.about ||
              "Santri Pondok Pesantren Lirboyo dan Mahasantri Ma'had Aly Lirboyo program studi Fiqh wa Ushuluh (Marhalah Ula). Mengintegrasikan ketelitian kaidah turats Islam dengan rekayasa modern full-stack web dan otomatisasi kecerdasan buatan (AI). Berpengalaman membangun sistem presensi gerbang ribuan jemaah, arsitektur data pesantren, dan risalah pemikiran ilmiah."}
          </Text>
        </View>

        {/* Riwayat Pendidikan & Sanad */}
        <View>
          <Text style={styles.sectionTitle}>Pendidikan &amp; Sanad Keilmuan</Text>
          {education.map((edu, idx) => (
            <View key={idx} style={styles.itemBlock}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.institution}</Text>
                <Text style={styles.itemPeriod}>{edu.period}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{edu.level}</Text>
              {edu.notes && <Text style={styles.itemDesc}>{edu.notes}</Text>}
            </View>
          ))}
        </View>

        {/* Pengalaman & Pengabdian */}
        <View>
          <Text style={styles.sectionTitle}>Pengalaman &amp; Khidmah Organisasi</Text>
          {experience.map((exp, idx) => (
            <View key={idx} style={styles.itemBlock}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.organization}</Text>
                <Text style={styles.itemPeriod}>{exp.period}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{exp.roles.join(" • ")}</Text>
            </View>
          ))}
        </View>

        {/* Portofolio Sistem Unggulan */}
        <View>
          <Text style={styles.sectionTitle}>Portofolio Proyek Terpilih</Text>
          {projects.slice(0, 3).map((proj, idx) => (
            <View key={idx} style={styles.itemBlock}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{proj.title}</Text>
                <Text style={styles.itemPeriod}>{proj.platform || "Web Platform"}</Text>
              </View>
              <Text style={styles.itemDesc}>{proj.description}</Text>
            </View>
          ))}
        </View>

        {/* Keahlian & Teknologi */}
        <View>
          <Text style={styles.sectionTitle}>Keahlian Teknis &amp; Turats</Text>
          <View style={styles.skillsGrid}>
            {skills.flatMap((s) => s.items).map((item, idx) => (
              <Text key={idx} style={styles.skillBadge}>
                {item}
              </Text>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Curriculum Vitae Resmi - Ahmad Chamdan Yuwafin</Text>
          <Text>Dihasilkan secara dinamis via www.chamdan.site</Text>
        </View>
      </Page>
    </Document>
  );
}
