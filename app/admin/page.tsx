"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  Sliders,
  ExternalLink,
  Copy,
  Check,
  X,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import initialClubs from "@/data/clubs.json";
import { Club } from "@/lib/recommendEngine";
import { KU_COLLEGES } from "@/lib/colleges";
import { containsProfanity, validateClubSubmission } from "@/lib/filter";

const CATEGORIES = [
  "IT/개발",
  "학술",
  "예술/공연",
  "스포츠",
  "봉사",
  "미디어/방송",
  "취미/친목",
  "창업",
  "사회과학",
  "종교",
];

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("전체");

  // Editing state
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInputText, setJsonInputText] = useState("");
  const [jsonError, setJsonError] = useState("");

  // Filter Live Test state
  const [filterTestText, setFilterTestText] = useState("");

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await fetch("/api/admin/clubs");
      if (res.ok) {
        const data = await res.json();
        setClubs(data);
      } else {
        setClubs(initialClubs as Club[]);
      }
    } catch (e) {
      console.error(e);
      setClubs(initialClubs as Club[]);
    }
  };

  const handleSaveToDisk = async (dataToSave?: Club[]) => {
    const targetData = dataToSave || clubs;
    setSaveStatus("저장 중...");
    try {
      const res = await fetch("/api/admin/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetData),
      });

      if (res.ok) {
        setSaveStatus("✅ 저장 완료!");
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        const errData = await res.json();
        setSaveStatus(`❌ 저장 실패: ${errData.error || "알 수 없는 오류"}`);
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (e) {
      console.error(e);
      setSaveStatus("❌ 에러 발생");
    }
  };

  const handleDeleteClub = (id: string) => {
    if (confirm("정말 이 동아리를 삭제하시겠습니까?")) {
      const updated = clubs.filter((c) => c.id !== id);
      setClubs(updated);
      handleSaveToDisk(updated);
    }
  };

  const handleOpenEdit = (club: Club) => {
    setEditingClub({ ...club });
    setKeywordsInput(club.keywords.join(", "));
    setIsAddingNew(false);
  };

  const handleOpenAdd = () => {
    const newClub: Club = {
      id: `club-custom-${Date.now()}`,
      name: "",
      category: ["취미/친목"],
      college: "전체",
      type: "중앙동아리",
      traits: {
        sociability: 3,
        activity: 3,
        creativity: 3,
        leadership: 3,
        expertise: 3,
      },
      keywords: [],
      description_short: "",
      external_link: "",
      recruit_period: "2026.09.01 ~ 09.12",
    };
    setEditingClub(newClub);
    setKeywordsInput("");
    setIsAddingNew(true);
  };

  const handleSaveClubForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClub || !editingClub.name) {
      alert("동아리 이름을 입력해주세요.");
      return;
    }

    const parsedKeywords = keywordsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // 1. Troll & Profanity & Link Validation Check
    const validation = validateClubSubmission({
      name: editingClub.name,
      summary: editingClub.description_short,
      description: editingClub.description_short,
      keywords: parsedKeywords,
      instagram: editingClub.external_link,
      website: editingClub.external_link,
      contact: editingClub.external_link,
    });

    if (!validation.isValid) {
      alert(`⚠️ 등록 불가: ${validation.error}`);
      return;
    }

    const clubToSave: Club = {
      ...editingClub,
      keywords: parsedKeywords,
    };

    let updatedList: Club[];
    if (isAddingNew) {
      updatedList = [clubToSave, ...clubs];
    } else {
      updatedList = clubs.map((c) => (c.id === clubToSave.id ? clubToSave : c));
    }

    setClubs(updatedList);
    setEditingClub(null);
    setKeywordsInput("");
    handleSaveToDisk(updatedList);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(clubs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clubs.json";
    a.click();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(clubs, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInputText);
      if (!Array.isArray(parsed)) {
        setJsonError("JSON 데이터는 동아리 객체의 배열이어야 합니다. ([{...}])");
        return;
      }
      setClubs(parsed);
      handleSaveToDisk(parsed);
      setShowJsonModal(false);
      setJsonInputText("");
      setJsonError("");
      alert(`총 ${parsed.length}개의 동아리 데이터가 성공적으로 반영되었습니다!`);
    } catch (e: any) {
      setJsonError("유효한 JSON 형식이 아닙니다: " + e.message);
    }
  };

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
      club.description_short.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCat === "전체" || club.category.includes(selectedCat);
    return matchesSearch && matchesCategory;
  });

  // Real-time live validation state for modal
  const liveValidation = editingClub
    ? validateClubSubmission({
        name: editingClub.name,
        summary: editingClub.description_short,
        description: editingClub.description_short,
        keywords: keywordsInput.split(",").map((s) => s.trim()).filter(Boolean),
        instagram: editingClub.external_link,
        website: editingClub.external_link,
        contact: editingClub.external_link,
      })
    : { isValid: true };

  // Live filter test inspection
  const testProfanityResult = containsProfanity(filterTestText);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-ku-crimson mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인 페이지로 돌아가기</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              고려대 동아리 등록 & 관리 스튜디오 🐯
            </h1>
            <span className="px-3 py-1 bg-ku-soft text-ku-crimson font-black text-xs rounded-full">
              총 {clubs.length}개 동아리
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            2학기 신입 부원을 모집하는 임원진 및 학생회를 위한 실시간 동아리 등록/관리 시스템입니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setJsonInputText(JSON.stringify(clubs, null, 2));
              setShowJsonModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>JSON 일괄 입력</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON 다운로드</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "복사됨!" : "클립보드 복사"}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-ku-crimson hover:bg-ku-dark text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>📢 새 동아리 등록하기</span>
          </button>
        </div>
      </div>

      {/* Security & Troll Shield Information + Live Tester */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Security Info Box */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/80 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-black text-slate-900 flex items-center gap-1.5">
              <span>🛡️ 트롤 방지 및 허위 정보 차단 안전 시스템 가동 중</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                실시간 작동
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              * 비속어/욕설/도배 단어 입력 시 실시간 차단되며, 허위 등록 방지를 위해 **공식 인스타그램(@아이디) 또는 웹사이트 링크**가 필수로 검증됩니다.
            </p>
          </div>
        </div>

        {/* Right: Live Profanity Tester Box */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>금지어 필터 실시간 테스트</span>
            </span>
            {filterTestText && (
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  testProfanityResult.isBlocked
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-emerald-500 text-white"
                }`}
              >
                {testProfanityResult.isBlocked ? "차단 (등록 불가)" : "통과 (안전)"}
              </span>
            )}
          </div>
          <input
            type="text"
            placeholder="단어를 입력하여 필터 테스트..."
            value={filterTestText}
            onChange={(e) => setFilterTestText(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Save Notification status */}
      {saveStatus && (
        <div className="p-3 bg-slate-900 text-white text-xs font-bold rounded-xl text-center shadow-lg animate-bounce">
          {saveStatus}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="동아리명, 키워드 검색..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-ku-crimson/20 focus:border-ku-crimson outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCat("전체")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCat === "전체"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            전체 ({clubs.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = clubs.filter((c) => c.category.includes(cat)).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCat === cat
                    ? "bg-ku-crimson text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Clubs Table List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">동아리명 (ID)</th>
                <th className="px-4 py-3">분과/카테고리</th>
                <th className="px-4 py-3">구분 / 단과대</th>
                <th className="px-4 py-3">5축 벡터 (사/활/창/리/전)</th>
                <th className="px-4 py-3">소개 & 링크</th>
                <th className="px-4 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredClubs.map((club) => (
                <tr key={club.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Name & ID */}
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <div>{club.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {club.id}
                    </div>
                  </td>

                  {/* Categories */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {club.category.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-rose-50 text-ku-crimson font-semibold rounded text-[10px] border border-rose-200/60"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* College / Type */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-800">{club.type}</div>
                    <div className="text-[11px] text-slate-500">{club.college}</div>
                  </td>

                  {/* Traits Vector */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      <span title="사교성" className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                        사:{club.traits.sociability}
                      </span>
                      <span title="활동성" className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                        활:{club.traits.activity}
                      </span>
                      <span title="창작성" className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                        창:{club.traits.creativity}
                      </span>
                      <span title="리더십" className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                        리:{club.traits.leadership}
                      </span>
                      <span title="전문성" className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                        전:{club.traits.expertise}
                      </span>
                    </div>
                  </td>

                  {/* Description & Link */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <p className="line-clamp-1 text-slate-600">{club.description_short}</p>
                    {club.external_link && (
                      <a
                        href={
                          club.external_link.startsWith("http")
                            ? club.external_link
                            : `https://instagram.com/${club.external_link.replace("@", "")}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-ku-crimson hover:underline mt-0.5 font-bold"
                      >
                        <span>{club.external_link}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(club)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-ku-crimson hover:bg-slate-100 transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClub(club.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <button
              onClick={() => setEditingClub(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-3">
              {isAddingNew ? "📢 새 동아리 등록" : `동아리 수정: ${editingClub.name}`}
            </h2>

            {/* Real-time Security Validation Status Banner inside Modal */}
            <div className="mb-4">
              {!liveValidation.isValid ? (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs font-bold animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-rose-900">⚠️ 등록 불가 (실시간 검증 차단)</div>
                    <div className="text-[11px] text-rose-700 mt-0.5">{liveValidation.error}</div>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>🛡️ 금지어/비속어 검사 완료 (등록 가능한 상태입니다)</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveClubForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    동아리 고유 ID
                  </label>
                  <input
                    type="text"
                    value={editingClub.id}
                    onChange={(e) => setEditingClub({ ...editingClub, id: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    동아리명 <span className="text-ku-crimson">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingClub.name}
                    onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                    required
                    placeholder="예: DevKor (데브코어)"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold transition-colors ${
                      containsProfanity(editingClub.name).isBlocked
                        ? "border-rose-500 bg-rose-50/50 text-rose-900 focus:ring-rose-500"
                        : "border-slate-200 focus:border-ku-crimson"
                    }`}
                  />
                  {containsProfanity(editingClub.name).isBlocked && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1">
                      🚫 동아리명에 부적절한 단어가 포함되어 있습니다.
                    </p>
                  )}
                </div>

                {/* College */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    소속 단과대학
                  </label>
                  <select
                    value={editingClub.college}
                    onChange={(e) => setEditingClub({ ...editingClub, college: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="전체">전체 (중앙동아리)</option>
                    {KU_COLLEGES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    동아리 구분
                  </label>
                  <select
                    value={editingClub.type}
                    onChange={(e) => setEditingClub({ ...editingClub, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="중앙동아리">중앙동아리</option>
                    <option value="단과대동아리">단과대동아리</option>
                    <option value="학회">학회</option>
                    <option value="소모임">소모임</option>
                  </select>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  카테고리 선택 (다중 선택 가능)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = editingClub.category.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          if (isSelected) {
                            if (editingClub.category.length > 1) {
                              setEditingClub({
                                ...editingClub,
                                category: editingClub.category.filter((c) => c !== cat),
                              });
                            }
                          } else {
                            setEditingClub({
                              ...editingClub,
                              category: [...editingClub.category, cat],
                            });
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          isSelected
                            ? "bg-ku-crimson text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5-Axis Traits Sliders */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-ku-crimson" />
                  <span>5축 성향 가중치 점수 (1 ~ 5)</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Sociability */}
                  <div>
                    <div className="flex justify-between font-bold text-amber-900 mb-1">
                      <span>사교성 (친목/뒤풀이)</span>
                      <span>{editingClub.traits.sociability}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={editingClub.traits.sociability}
                      onChange={(e) =>
                        setEditingClub({
                          ...editingClub,
                          traits: { ...editingClub.traits, sociability: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Activity */}
                  <div>
                    <div className="flex justify-between font-bold text-rose-900 mb-1">
                      <span>활동성 (몸/현장/체력)</span>
                      <span>{editingClub.traits.activity}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={editingClub.traits.activity}
                      onChange={(e) =>
                        setEditingClub({
                          ...editingClub,
                          traits: { ...editingClub.traits, activity: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-rose-500"
                    />
                  </div>

                  {/* Creativity */}
                  <div>
                    <div className="flex justify-between font-bold text-purple-900 mb-1">
                      <span>창작성 (예술/콘텐츠)</span>
                      <span>{editingClub.traits.creativity}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={editingClub.traits.creativity}
                      onChange={(e) =>
                        setEditingClub({
                          ...editingClub,
                          traits: { ...editingClub.traits, creativity: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-purple-500"
                    />
                  </div>

                  {/* Leadership */}
                  <div>
                    <div className="flex justify-between font-bold text-blue-900 mb-1">
                      <span>리더십 (기획/조직)</span>
                      <span>{editingClub.traits.leadership}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={editingClub.traits.leadership}
                      onChange={(e) =>
                        setEditingClub({
                          ...editingClub,
                          traits: { ...editingClub.traits, leadership: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Expertise */}
                  <div className="sm:col-span-2">
                    <div className="flex justify-between font-bold text-indigo-900 mb-1">
                      <span>전문성 (스펙/실무/학술)</span>
                      <span>{editingClub.traits.expertise}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={editingClub.traits.expertise}
                      onChange={(e) =>
                        setEditingClub({
                          ...editingClub,
                          traits: { ...editingClub.traits, expertise: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  매칭 키워드 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="예: 웹개발, 해커톤, 풀스택, 코딩"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  한 줄 소개 요약
                </label>
                <textarea
                  value={editingClub.description_short}
                  onChange={(e) =>
                    setEditingClub({ ...editingClub, description_short: e.target.value })
                  }
                  rows={2}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs ${
                    containsProfanity(editingClub.description_short).isBlocked
                      ? "border-rose-500 bg-rose-50/50 text-rose-900"
                      : "border-slate-200"
                  }`}
                />
                {containsProfanity(editingClub.description_short).isBlocked && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">
                    🚫 소개글에 부적절한 단어가 포함되어 있습니다.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {/* External Link (Mandatory Verification) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-800">
                      공식 인스타그램 또는 웹사이트 링크 <span className="text-ku-crimson font-black">* (필수)</span>
                    </label>
                    <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                      신원 확인용 필수
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="예: https://instagram.com/ku_0kcal 또는 @ku_0kcal 또는 동아리 웹사이트 URL"
                    value={editingClub.external_link}
                    onChange={(e) =>
                      setEditingClub({ ...editingClub, external_link: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-ku-crimson focus:bg-white rounded-xl text-xs transition-colors"
                  />
                  {/* Red Required Caption */}
                  <p className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1 leading-snug">
                    <span>* 허위 정보 등록 방지를 위해 동아리 공식 인스타그램(@아이디) 또는 웹사이트 링크를 반드시 기입해 주세요. (미기입 시 등록 불가)</span>
                  </p>
                </div>

                {/* Recruit Period */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2학기 부원 모집 기간
                  </label>
                  <input
                    type="text"
                    placeholder="예: 2026.09.01 ~ 09.12 또는 상시 모집"
                    value={editingClub.recruit_period}
                    onChange={(e) =>
                      setEditingClub({ ...editingClub, recruit_period: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingClub(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!liveValidation.isValid}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black shadow-md transition-all ${
                    liveValidation.isValid
                      ? "bg-ku-crimson text-white hover:bg-ku-dark cursor-pointer active:scale-95"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                  }`}
                >
                  {liveValidation.isValid ? "✅ 동아리 저장하기" : "🚫 입력 정보 확인 필요"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON Import Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowJsonModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-2">
              JSON 데이터 일괄 수정 / 붙여넣기
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              정제된 동아리 JSON 배열 데이터를 아래에 붙여넣으시면 전체 데이터베이스가 즉시 교체됩니다.
            </p>

            <textarea
              value={jsonInputText}
              onChange={(e) => setJsonInputText(e.target.value)}
              rows={12}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 rounded-2xl border border-slate-800 outline-none focus:border-ku-crimson"
              placeholder="[{ ... }]"
            />

            {jsonError && (
              <p className="text-xs font-bold text-rose-600 mt-2">{jsonError}</p>
            )}

            <div className="flex items-center justify-end gap-2.5 mt-4">
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
              >
                취소
              </button>
              <button
                onClick={handleImportJson}
                className="px-6 py-2.5 rounded-xl bg-ku-crimson text-white text-xs font-black shadow-md hover:bg-ku-dark"
              >
                데이터 전체 반영하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
