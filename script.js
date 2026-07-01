/* ===========================================================
   NAGA ERP — Module Tuyển dụng — Demo logic (pure JS, no deps)
=========================================================== */

/* ---------------- MOCK DATA ---------------- */

const DEPARTMENTS = ["Kinh doanh","Kỹ thuật","Marketing","Nhân sự","Kế toán","CSKH"];
const SOURCES = ["Facebook","LinkedIn","TopCV","Giới thiệu nội bộ","Website công ty","Headhunter"];
const CHANNELS = ["TopCV","LinkedIn","Facebook Ads","Website công ty","Headhunter"];

const STAGE_LABELS = {
  new:"Tiếp nhận CV",
  processing:"Process hồ sơ",
  interview1:"Hẹn PV vòng 1",
  interview2:"Hẹn PV vòng 2",
  interview3:"Hẹn PV vòng 3",
  done:"Hoàn thành tuyển dụng",
  rejected:"Không phù hợp"
};
const STAGE_ORDER = ["new","processing","interview1","interview2","interview3","done"];

const jobPostings = [
  {id:1, code:"TD-2026-001", title:"Nhân viên Kinh doanh B2B", dept:"Kinh doanh", position:"Nhân viên Kinh doanh", qty:3, recruited:1, recruiting:2, startDate:"2026-05-01", endDate:"2026-07-01", owner:"Nguyễn Thu Hà", status:"open", channel:"TopCV", description:"Tìm kiếm và phát triển khách hàng doanh nghiệp khu vực miền Bắc.", requirement:"Tốt nghiệp Đại học, 1 năm kinh nghiệm sales B2B, giao tiếp tốt.", benefit:"Lương cứng + hoa hồng, BHXH đầy đủ.", note:"Ưu tiên ứng viên có kinh nghiệm ngành sản xuất."},
  {id:2, code:"TD-2026-002", title:"Lập trình viên Backend (Java)", dept:"Kỹ thuật", position:"Lập trình viên Backend", qty:2, recruited:0, recruiting:2, startDate:"2026-04-15", endDate:"2026-06-30", owner:"Trần Văn Long", status:"open", channel:"LinkedIn", description:"Phát triển hệ thống ERP nội bộ, module tuyển dụng & nhân sự.", requirement:"2+ năm Java Spring Boot, hiểu CSDL quan hệ.", benefit:"Thưởng dự án, làm việc hybrid.", note:""},
  {id:3, code:"TD-2026-003", title:"Chuyên viên Marketing Digital", dept:"Marketing", position:"Chuyên viên Marketing", qty:1, recruited:1, recruiting:0, startDate:"2026-03-01", endDate:"2026-04-01", owner:"Phạm Minh Anh", status:"closed", channel:"Facebook Ads", description:"Quản trị các kênh digital marketing, lên kế hoạch nội dung.", requirement:"1 năm kinh nghiệm chạy ads, content.", benefit:"Thưởng KPI hàng tháng.", note:"Đã tuyển đủ, đóng tin."},
  {id:4, code:"TD-2026-004", title:"Chuyên viên Tuyển dụng (HCNS)", dept:"Nhân sự", position:"Chuyên viên Tuyển dụng", qty:2, recruited:0, recruiting:1, startDate:"2026-06-01", endDate:"2026-08-01", owner:"Nguyễn Thu Hà", status:"open", channel:"Website công ty", description:"Triển khai tuyển dụng các vị trí khối văn phòng.", requirement:"1-2 năm kinh nghiệm tuyển dụng.", benefit:"Môi trường năng động.", note:""},
  {id:5, code:"TD-2026-005", title:"Kế toán tổng hợp", dept:"Kế toán", position:"Kế toán viên", qty:1, recruited:0, recruiting:0, startDate:"2026-06-10", endDate:"", owner:"Lê Quốc Bảo", status:"draft", channel:"TopCV", description:"Phụ trách kế toán tổng hợp, báo cáo thuế.", requirement:"Tốt nghiệp chuyên ngành Kế toán, 2 năm kinh nghiệm.", benefit:"Thưởng lễ Tết, BHXH.", note:"Đang chờ duyệt ngân sách."},
  {id:6, code:"TD-2026-006", title:"Nhân viên CSKH", dept:"CSKH", position:"Nhân viên CSKH", qty:2, recruited:0, recruiting:1, startDate:"2026-05-20", endDate:"2026-07-20", owner:"Đỗ Hải Yến", status:"paused", channel:"Facebook Ads", description:"Hỗ trợ, chăm sóc khách hàng qua tổng đài.", requirement:"Giao tiếp tốt, chịu được áp lực.", benefit:"Lương cứng + phụ cấp ca.", note:"Tạm dừng do review lại ngân sách quý."}
];

const candidates = [
  {id:1, code:"UV-0001", name:"Hoàng Văn An", dob:"1998-02-14", gender:"Nam", phone:"0901234561", email:"an.hoang@gmail.com", address:"Hà Nội", source:"TopCV", position:"Nhân viên Kinh doanh", dept:"Kinh doanh", jobId:1, owner:"Nguyễn Thu Hà", status:"interview2", receivedDate:"2026-06-05", round1:"Đạt", round2:"", round3:"", note:"Giao tiếp tự tin, hiểu sản phẩm nhanh.",
    history:[["05/06","Tiếp nhận CV"],["07/06","Process hồ sơ"],["10/06","Hẹn PV vòng 1"],["12/06","Đạt vòng 1"],["20/06","Hẹn PV vòng 2"]]},
  {id:2, code:"UV-0002", name:"Lê Thị Bích", dob:"1999-07-22", gender:"Nữ", phone:"0901234562", email:"bich.le@gmail.com", address:"Hà Nội", source:"LinkedIn", position:"Lập trình viên Backend", dept:"Kỹ thuật", jobId:2, owner:"Trần Văn Long", status:"interview1", receivedDate:"2026-06-10", round1:"", round2:"", round3:"", note:"CV kỹ thuật tốt, cần kiểm tra thực hành.",
    history:[["10/06","Tiếp nhận CV"],["11/06","Process hồ sơ"],["18/06","Hẹn PV vòng 1"]]},
  {id:3, code:"UV-0003", name:"Phạm Quốc Cường", dob:"1997-11-03", gender:"Nam", phone:"0901234563", email:"cuong.pham@gmail.com", address:"Hưng Yên", source:"Facebook", position:"Lập trình viên Backend", dept:"Kỹ thuật", jobId:2, owner:"Trần Văn Long", status:"rejected", receivedDate:"2026-05-28", round1:"Không đạt", round2:"", round3:"", note:"Thiếu kinh nghiệm thực tế với Spring Boot.",
    history:[["28/05","Tiếp nhận CV"],["29/05","Process hồ sơ"],["02/06","Hẹn PV vòng 1"],["03/06","Không đạt vòng 1"],["03/06","Không phù hợp — đã gửi thư cảm ơn"]]},
  {id:4, code:"UV-0004", name:"Vũ Thị Dung", dob:"2000-01-19", gender:"Nữ", phone:"0901234564", email:"dung.vu@gmail.com", address:"Bắc Ninh", source:"Website công ty", position:"Chuyên viên Marketing", dept:"Marketing", jobId:3, owner:"Phạm Minh Anh", status:"done", receivedDate:"2026-03-02", round1:"Đạt", round2:"Đạt", round3:"", note:"Phù hợp, đã offer thành công.",
    history:[["02/03","Tiếp nhận CV"],["03/03","Process hồ sơ"],["06/03","Hẹn PV vòng 1"],["07/03","Đạt vòng 1"],["10/03","Hẹn PV vòng 2"],["11/03","Đạt vòng 2"],["12/03","Hoàn thành tuyển dụng"]]},
  {id:5, code:"UV-0005", name:"Đặng Văn Em", dob:"1996-09-09", gender:"Nam", phone:"0901234565", email:"em.dang@gmail.com", address:"Hà Nội", source:"Giới thiệu nội bộ", position:"Chuyên viên Tuyển dụng", dept:"Nhân sự", jobId:4, owner:"Nguyễn Thu Hà", status:"processing", receivedDate:"2026-06-18", round1:"", round2:"", round3:"", note:"Đang sàng lọc hồ sơ.",
    history:[["18/06","Tiếp nhận CV"],["19/06","Process hồ sơ"]]},
  {id:6, code:"UV-0006", name:"Bùi Thị Phương", dob:"1998-05-30", gender:"Nữ", phone:"0901234566", email:"phuong.bui@gmail.com", address:"Hải Phòng", source:"TopCV", position:"Nhân viên CSKH", dept:"CSKH", jobId:6, owner:"Đỗ Hải Yến", status:"new", receivedDate:"2026-06-25", round1:"", round2:"", round3:"", note:"",
    history:[["25/06","Tiếp nhận CV"]]},
  {id:7, code:"UV-0007", name:"Ngô Văn Giang", dob:"1995-03-12", gender:"Nam", phone:"0901234567", email:"giang.ngo@gmail.com", address:"Hà Nội", source:"Headhunter", position:"Lập trình viên Backend", dept:"Kỹ thuật", jobId:2, owner:"Trần Văn Long", status:"interview3", receivedDate:"2026-05-15", round1:"Đạt", round2:"Đạt", round3:"", note:"Ứng viên tiềm năng, vòng cuối với trưởng phòng.",
    history:[["15/05","Tiếp nhận CV"],["16/05","Process hồ sơ"],["20/05","Hẹn PV vòng 1"],["21/05","Đạt vòng 1"],["28/05","Hẹn PV vòng 2"],["29/05","Đạt vòng 2"],["15/06","Hẹn PV vòng 3"]]},
  {id:8, code:"UV-0008", name:"Trịnh Thị Hoa", dob:"1999-12-01", gender:"Nữ", phone:"0901234568", email:"hoa.trinh@gmail.com", address:"Hà Nội", source:"LinkedIn", position:"Nhân viên Kinh doanh", dept:"Kinh doanh", jobId:1, owner:"Nguyễn Thu Hà", status:"rejected", receivedDate:"2026-06-01", round1:"Không đạt", round2:"", round3:"", note:"Chưa đủ kinh nghiệm đàm phán khách hàng lớn.",
    history:[["01/06","Tiếp nhận CV"],["02/06","Process hồ sơ"],["05/06","Hẹn PV vòng 1"],["06/06","Không đạt vòng 1"],["06/06","Không phù hợp — đã gửi thư cảm ơn"]]}
];

const interviews = [
  {id:1, candidateId:1, round:2, datetime:"2026-07-02 09:30", type:"Offline", location:"Phòng họp tầng 5 - Trụ sở chính", link:"", interviewer:"Nguyễn Văn Tùng (TP. Kinh doanh)", supporter:"Nguyễn Thu Hà", note:"Ứng viên đã đạt vòng 1, phỏng vấn chuyên môn vòng 2.", status:"Đã gửi mời"},
  {id:2, candidateId:2, round:1, datetime:"2026-07-01 14:00", type:"Online", location:"", link:"https://meet.google.com/abc-defg-hij", interviewer:"Trần Văn Long (TP. Kỹ thuật)", supporter:"", note:"Phỏng vấn kỹ thuật vòng 1.", status:"Đã gửi mời"},
  {id:3, candidateId:7, round:3, datetime:"2026-07-03 10:00", type:"Offline", location:"Phòng họp Ban Giám đốc", link:"", interviewer:"Giám đốc Kỹ thuật", supporter:"Trần Văn Long", note:"Vòng cuối, quyết định offer.", status:"Đã lên lịch"},
  {id:4, candidateId:5, round:1, datetime:"2026-06-27 09:00", type:"Online", location:"", link:"https://meet.google.com/hr-vong1", interviewer:"Nguyễn Thu Hà (TP. Nhân sự)", supporter:"", note:"", status:"Đã lên lịch"},
  {id:5, candidateId:6, round:1, datetime:"2026-06-30 15:30", type:"Offline", location:"Phòng họp tầng 3", link:"", interviewer:"Đỗ Hải Yến", supporter:"", note:"Mới tiếp nhận CV, cần process trước.", status:"Chưa gửi mời"}
];

const interviewResults = [
  {id:1, candidateId:1, round:1, evaluator:"Nguyễn Văn Tùng", score:8.5, result:"Đạt", comment:"Kỹ năng giao tiếp tốt, nắm rõ sản phẩm."},
  {id:2, candidateId:3, round:1, evaluator:"Trần Văn Long", score:4.5, result:"Không đạt", comment:"Chưa đáp ứng yêu cầu kỹ thuật Spring Boot."},
  {id:3, candidateId:7, round:2, evaluator:"Trần Văn Long", score:8.0, result:"Đạt", comment:"Tư duy hệ thống tốt, sẵn sàng vào vòng 3."},
  {id:4, candidateId:8, round:1, evaluator:"Nguyễn Văn Tùng", score:5.0, result:"Không đạt", comment:"Thiếu kinh nghiệm đàm phán khách hàng lớn."},
  {id:5, candidateId:4, round:2, evaluator:"Phạm Minh Anh", score:9.0, result:"Đạt", comment:"Rất phù hợp, đề xuất offer ngay."}
];

const headcount = [
  {dept:"Kinh doanh", position:"Nhân viên Kinh doanh", quota:10, current:7, approved:3, recruiting:2, recruited:1},
  {dept:"Kỹ thuật", position:"Lập trình viên Backend", quota:6, current:4, approved:2, recruiting:2, recruited:0},
  {dept:"Marketing", position:"Chuyên viên Marketing", quota:3, current:3, approved:0, recruiting:0, recruited:1},
  {dept:"Nhân sự", position:"Chuyên viên Tuyển dụng", quota:4, current:3, approved:1, recruiting:1, recruited:0},
  {dept:"Kế toán", position:"Kế toán viên", quota:3, current:3, approved:1, recruiting:0, recruited:0},
  {dept:"CSKH", position:"Nhân viên CSKH", quota:8, current:5, approved:1, recruiting:1, recruited:0},
  {dept:"Kỹ thuật", position:"Tester", quota:2, current:1, approved:1, recruiting:2, recruited:0}
];
headcount.forEach(h=>{
  h.shortage = h.quota - h.current - h.recruiting;
  if(h.shortage < 0 || (h.current + h.recruiting) > h.quota) h.color = "red";
  else if(h.shortage === 0) h.color = "yellow";
  else h.color = "green";
  h.overApproved = h.recruiting > h.approved;
});

const emailTemplates = [
  {id:1, code:"TPL-PV1", name:"Thư mời phỏng vấn vòng 1", trigger:"Khi chuyển trạng thái sang \"Hẹn phỏng vấn vòng 1\"", subject:"[NAGA ERP] Thư mời phỏng vấn vòng 1 - {{vi_tri_ung_tuyen}}",
    body:"Kính gửi {{ho_ten_ung_vien}},\n\nCảm ơn bạn đã quan tâm ứng tuyển vị trí {{vi_tri_ung_tuyen}} tại công ty. Chúng tôi trân trọng mời bạn tham gia phỏng vấn vòng 1:\n\n- Thời gian: {{thoi_gian_phong_van}}\n- Hình thức: {{hinh_thuc_phong_van}}\n- Địa điểm/Link: {{dia_diem_link}}\n- Người liên hệ: {{nguoi_lien_he}}\n\nGhi chú: {{ghi_chu}}\n\nTrân trọng."},
  {id:2, code:"TPL-PV2", name:"Thư mời phỏng vấn vòng 2", trigger:"Khi chuyển trạng thái sang \"Hẹn phỏng vấn vòng 2\"", subject:"[NAGA ERP] Thư mời phỏng vấn vòng 2 - {{vi_tri_ung_tuyen}}",
    body:"Kính gửi {{ho_ten_ung_vien}},\n\nChúc mừng bạn đã vượt qua vòng phỏng vấn đầu tiên. Mời bạn tham gia phỏng vấn vòng 2:\n\n- Thời gian: {{thoi_gian_phong_van}}\n- Hình thức: {{hinh_thuc_phong_van}}\n- Địa điểm/Link: {{dia_diem_link}}\n- Người liên hệ: {{nguoi_lien_he}}\n\nTrân trọng."},
  {id:3, code:"TPL-PV3", name:"Thư mời phỏng vấn vòng 3", trigger:"Khi chuyển trạng thái sang \"Hẹn phỏng vấn vòng 3\"", subject:"[NAGA ERP] Thư mời phỏng vấn vòng 3 (vòng cuối) - {{vi_tri_ung_tuyen}}",
    body:"Kính gửi {{ho_ten_ung_vien}},\n\nMời bạn tham gia vòng phỏng vấn cuối cùng:\n\n- Thời gian: {{thoi_gian_phong_van}}\n- Hình thức: {{hinh_thuc_phong_van}}\n- Địa điểm/Link: {{dia_diem_link}}\n- Người liên hệ: {{nguoi_lien_he}}\n\nTrân trọng."},
  {id:4, code:"TPL-THANKS", name:"Thư cảm ơn (Không phù hợp)", trigger:"Khi hồ sơ chuyển trạng thái \"Không phù hợp\"", subject:"[NAGA ERP] Cảm ơn bạn đã ứng tuyển - {{vi_tri_ung_tuyen}}",
    body:"Kính gửi {{ho_ten_ung_vien}},\n\nCảm ơn bạn đã dành thời gian ứng tuyển vị trí {{vi_tri_ung_tuyen}}. Hiện tại hồ sơ của bạn chưa phù hợp với yêu cầu vị trí này. Chúng tôi sẽ lưu lại hồ sơ và liên hệ khi có cơ hội phù hợp hơn.\n\nTrân trọng."},
  {id:5, code:"TPL-OFFER", name:"Thư nhận việc (Offer)", trigger:"Khi hồ sơ chuyển trạng thái \"Hoàn thành tuyển dụng\"", subject:"[NAGA ERP] Thư mời nhận việc - {{vi_tri_ung_tuyen}}",
    body:"Kính gửi {{ho_ten_ung_vien}},\n\nChúc mừng bạn đã trúng tuyển vị trí {{vi_tri_ung_tuyen}}. Bộ phận Nhân sự sẽ liên hệ để hướng dẫn thủ tục nhận việc.\n\nTrân trọng."}
];

const workflowSteps = [
  {order:1, name:"Tiếp nhận CV", sendEmail:false, sendNotification:false, requireEval:false, autoNext:false},
  {order:2, name:"Process hồ sơ", sendEmail:false, sendNotification:true, requireEval:false, autoNext:false},
  {order:3, name:"Hẹn phỏng vấn vòng 1", sendEmail:true, sendNotification:true, requireEval:false, autoNext:false},
  {order:4, name:"Kết quả phỏng vấn vòng 1", sendEmail:false, sendNotification:false, requireEval:true, autoNext:true},
  {order:5, name:"Hẹn phỏng vấn vòng 2", sendEmail:true, sendNotification:true, requireEval:false, autoNext:false},
  {order:6, name:"Kết quả phỏng vấn vòng 2", sendEmail:false, sendNotification:false, requireEval:true, autoNext:true},
  {order:7, name:"Hẹn phỏng vấn vòng 3", sendEmail:true, sendNotification:true, requireEval:false, autoNext:false},
  {order:8, name:"Kết quả phỏng vấn vòng 3", sendEmail:false, sendNotification:false, requireEval:true, autoNext:true},
  {order:9, name:"Không phù hợp", sendEmail:true, sendNotification:false, requireEval:false, autoNext:false},
  {order:10, name:"Hoàn thành tuyển dụng", sendEmail:true, sendNotification:true, requireEval:false, autoNext:false}
];

let nextCandidateId = 9;
let nextJobId = 7;

/* ---------------- HELPERS ---------------- */

function fmtDate(s){
  if(!s) return "";
  const datePart = s.split(" ")[0];
  const [y,m,d] = datePart.split("-");
  const time = s.includes(" ") ? " " + s.split(" ")[1] : "";
  return `${d}/${m}/${y}${time}`;
}

function jobStatusBadge(status){
  const map = {
    draft:["badge-draft","Nháp"],
    open:["badge-success","Đang tuyển"],
    paused:["badge-progress","Tạm dừng"],
    closed:["badge-danger","Đã đóng"]
  };
  const [cls,label] = map[status] || map.draft;
  return `<span class="badge ${cls}">${label}</span>`;
}

function candidateStatusBadge(status){
  const map = {
    new:["badge-draft", STAGE_LABELS.new],
    processing:["badge-info", STAGE_LABELS.processing],
    interview1:["badge-progress", STAGE_LABELS.interview1],
    interview2:["badge-progress", STAGE_LABELS.interview2],
    interview3:["badge-progress", STAGE_LABELS.interview3],
    done:["badge-success", STAGE_LABELS.done],
    rejected:["badge-danger", STAGE_LABELS.rejected]
  };
  const [cls,label] = map[status] || map.new;
  return `<span class="badge ${cls}">${label}</span>`;
}

function headcountDot(color){
  const map = {green:"🟢 Bình thường", yellow:"🟡 Sắp đủ", red:"🔴 Vượt định biên"};
  return map[color];
}

function jobById(id){ return jobPostings.find(j=>j.id===Number(id)); }
function candidateById(id){ return candidates.find(c=>c.id===Number(id)); }

let infoIdSeq = 0;
function info(text){
  const id = "tip"+(++infoIdSeq);
  PENDING_TIPS[id] = text;
  return `<span class="info-icon" data-tip-id="${id}">i</span>`;
}
const PENDING_TIPS = {};

function toast(msg){
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = "position:fixed;bottom:20px;right:20px;background:#1f1b21;color:#fff;padding:11px 16px;border-radius:6px;font-size:12.8px;z-index:2000;box-shadow:0 2px 10px rgba(0,0,0,.25);max-width:320px;line-height:1.5;animation:fadeIn .2s ease;";
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.transition="opacity .3s"; t.style.opacity="0"; setTimeout(()=>t.remove(),300); }, 2600);
}

/* ---------------- ROUTER ---------------- */

const viewRoot = document.getElementById("viewRoot");

const ROUTES = {
  "dashboard": ()=>renderDashboard(),
  "job-list": ()=>renderJobList(),
  "job-form": (id)=>renderJobForm(id),
  "candidate-list": ()=>renderCandidateList(),
  "candidate-form": (id)=>renderCandidateForm(id),
  "pipeline": ()=>renderPipeline(),
  "interview-list": ()=>renderInterviewList(),
  "interview-result": ()=>renderInterviewResult(),
  "headcount": ()=>renderHeadcount(),
  "report-monthly":   ()=>renderReportMonthly(),
  "report-dept":      ()=>renderReportDept(),
  "report-source":    ()=>renderReportSource(),
  "report-funnel":    ()=>renderReportFunnel(),
  "report-headcount": ()=>renderReportHeadcount(),
  "email-templates": ()=>renderEmailTemplates(),
  "email-template-form": (id)=>renderEmailTemplateForm(id),
  "workflow-config": ()=>renderWorkflowConfig()
};

function parseHash(){
  let h = window.location.hash.replace(/^#\//,"");
  if(!h) h = "dashboard";
  const [route, id] = h.split("/");
  return {route, id};
}

function navigate(route, id){
  window.location.hash = id!==undefined ? `/${route}/${id}` : `/${route}`;
}

const CONFIG_ROUTES = ["email-templates","email-template-form","workflow-config"];
const REPORT_ROUTES = ["report-monthly","report-dept","report-source","report-funnel","report-headcount"];

function router(){
  const {route, id} = parseHash();
  const fn = ROUTES[route] || ROUTES["dashboard"];

  document.querySelectorAll(".nav-item[data-route]").forEach(m=>
    m.classList.toggle("active", m.dataset.route===route));
  document.querySelectorAll(".nav-dd-item[data-route]").forEach(m=>
    m.classList.toggle("active", m.dataset.route===route));
  const ddConfig = document.getElementById("ddConfig");
  if(ddConfig) ddConfig.classList.toggle("active", CONFIG_ROUTES.includes(route));
  const ddReports = document.getElementById("ddReports");
  if(ddReports) ddReports.classList.toggle("active", REPORT_ROUTES.includes(route));

  fn(id);
  bindInfoIcons();
  closeDevPopover();
  document.getElementById("ddConfigMenu")?.classList.remove("show");
  document.getElementById("ddReportsMenu")?.classList.remove("show");
  window.scrollTo({top:0});
}

window.addEventListener("hashchange", router);

function setBreadcrumb(parts){
  document.title = "Naga ERP — " + parts.map(p=>p.label).join(" / ");
}

function mount(html){
  viewRoot.innerHTML = `<div class="view-fade">${html}</div>`;
}

/* ---------------- DEV INFO POPOVER ---------------- */

function bindInfoIcons(){
  document.querySelectorAll(".info-icon[data-tip-id]").forEach(icon=>{
    icon.addEventListener("click", (e)=>{
      e.stopPropagation();
      const text = PENDING_TIPS[icon.dataset.tipId] || "";
      showDevPopover(icon, text);
    });
  });
}
function showDevPopover(anchor, text){
  const pop = document.getElementById("devPopover");
  pop.innerHTML = text;
  pop.classList.add("show");
  const r = anchor.getBoundingClientRect();
  let left = r.left;
  let top = r.bottom + 10;
  const maxLeft = window.innerWidth - 320;
  if(left > maxLeft) left = maxLeft;
  pop.style.left = left+"px";
  pop.style.top = top+"px";
}
function closeDevPopover(){
  document.getElementById("devPopover").classList.remove("show");
}
document.addEventListener("click", (e)=>{
  if(!e.target.closest(".dev-popover") && !e.target.closest(".info-icon")) closeDevPopover();
});

/* ---------------- MODAL ---------------- */

function openModal(title, bodyHtml, footHtml=""){
  document.getElementById("modalBox").innerHTML = `
    <div class="modal-head"><h2>${title}</h2><button class="modal-close" id="modalCloseBtn">&times;</button></div>
    <div class="modal-body">${bodyHtml}</div>
    ${footHtml ? `<div class="modal-foot">${footHtml}</div>` : ""}
  `;
  document.getElementById("modalOverlay").classList.add("show");
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  bindInfoIcons();
}
function closeModal(){
  document.getElementById("modalOverlay").classList.remove("show");
}
document.getElementById("modalOverlay").addEventListener("click",(e)=>{
  if(e.target.id==="modalOverlay") closeModal();
});

function countBy(arr, keyFn){
  const m = {};
  arr.forEach(item=>{ const k = keyFn(item); m[k] = (m[k]||0)+1; });
  return m;
}

/* ---------------- REC-08 DASHBOARD ---------------- */

function renderDashboard(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Dashboard"}]);

  const kpis = [
    {label:"Tin tuyển dụng đang mở", val: jobPostings.filter(j=>j.status==="open").length, cls:""},
    {label:"CV tiếp nhận", val: candidates.length, cls:"c-info"},
    {label:"Đang Process", val: candidates.filter(c=>c.status==="processing").length, cls:"c-info"},
    {label:"PV vòng 1", val: candidates.filter(c=>c.status==="interview1").length, cls:"c-progress"},
    {label:"PV vòng 2", val: candidates.filter(c=>c.status==="interview2").length, cls:"c-progress"},
    {label:"PV vòng 3", val: candidates.filter(c=>c.status==="interview3").length, cls:"c-progress"},
    {label:"Đạt tuyển dụng", val: candidates.filter(c=>c.status==="done").length, cls:"c-success"},
    {label:"Không đạt", val: candidates.filter(c=>c.status==="rejected").length, cls:"c-danger"}
  ];

  const byDept = countBy(candidates, c=>c.dept);
  const bySource = countBy(candidates, c=>c.source);
  const byMonth = countBy(candidates, c=>c.receivedDate.slice(0,7));
  const maxDept = Math.max(...Object.values(byDept));
  const maxSource = Math.max(...Object.values(bySource));
  const maxMonth = Math.max(...Object.values(byMonth));

  const done = candidates.filter(c=>c.status==="done").length;
  const rejected = candidates.filter(c=>c.status==="rejected").length;
  const inProgress = candidates.length - done - rejected;
  const total = candidates.length || 1;

  const barHtml = (data, max)=>Object.entries(data).map(([k,v])=>`
    <div class="bar-row">
      <div class="bar-label">${k}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(v/max*100).toFixed(0)}%"></div></div>
      <div class="bar-val">${v}</div>
    </div>`).join("");

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>Dashboard tuyển dụng <span class="screen-tag">REC-08</span></h1>
        <div class="subtitle">Theo dõi tổng quan tình hình tuyển dụng toàn công ty theo thời gian thực</div>
      </div>
    </div>

    <div class="info-banner">
      <span class="info-icon" style="margin-top:2px;" data-tip-id="dash-tip">i</span>
      <div><b>Mục đích màn hình</b>Tổng hợp số liệu từ Datapool ứng viên và Tin tuyển dụng để Ban lãnh đạo/HCNS theo dõi số lượng đang tuyển, đã tuyển, tỷ lệ đạt theo từng phòng ban/nguồn ứng viên — không phải nơi nhập liệu.</div>
    </div>

    <div class="kpi-grid">
      ${kpis.map(k=>`<div class="kpi-card ${k.cls}"><div class="kpi-val">${k.val}</div><div class="kpi-label">${k.label}</div></div>`).join("")}
    </div>

    <div class="chart-grid">
      <div class="chart-card">
        <h3>Ứng viên theo phòng ban ${info("Group theo trường <b>Phòng ban</b> trong hồ sơ ứng viên — giúp phát hiện phòng ban nào đang dồn nhiều CV chưa xử lý.")}</h3>
        ${barHtml(byDept, maxDept)}
      </div>
      <div class="chart-card">
        <h3>Ứng viên theo nguồn ${info("Group theo trường <b>Nguồn ứng viên</b> — đánh giá kênh tuyển dụng nào hiệu quả nhất để phân bổ ngân sách.")}</h3>
        ${barHtml(bySource, maxSource)}
      </div>
      <div class="chart-card">
        <h3>Ứng viên theo tháng tiếp nhận</h3>
        ${barHtml(byMonth, maxMonth)}
      </div>
      <div class="chart-card">
        <h3>Tỷ lệ đạt / không đạt / đang xử lý ${info("Tỷ lệ đạt = Số ứng viên trạng thái 'Hoàn thành tuyển dụng' / Tổng số ứng viên. Dùng để đánh giá hiệu quả phễu tuyển dụng (recruitment funnel).")}</h3>
        <div class="donut-wrap">
          ${donutSvg([
            {v:done, color:"#3aa655"},
            {v:rejected, color:"#d9534f"},
            {v:inProgress, color:"#e0a324"}
          ])}
          <div class="donut-legend">
            <div class="li"><span class="legend-dot" style="background:#3aa655"></span>Đạt — ${done} (${(done/total*100).toFixed(0)}%)</div>
            <div class="li"><span class="legend-dot" style="background:#d9534f"></span>Không đạt — ${rejected} (${(rejected/total*100).toFixed(0)}%)</div>
            <div class="li"><span class="legend-dot" style="background:#e0a324"></span>Đang xử lý — ${inProgress} (${(inProgress/total*100).toFixed(0)}%)</div>
          </div>
        </div>
      </div>
    </div>
  `);

  PENDING_TIPS["dash-tip"] = "Dashboard chỉ đọc dữ liệu (read-only), tổng hợp real-time từ Tin tuyển dụng (REC-01) và Datapool ứng viên (REC-03). Không có thao tác ghi dữ liệu tại màn hình này.";
}

/* ---------------- REC-01 / REC-02 — TIN TUYỂN DỤNG ---------------- */

const jobFilterState = {code:"", title:"", dept:"", position:"", status:"", owner:""};

function renderJobList(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Tin tuyển dụng"}]);

  const positions = [...new Set(jobPostings.map(j=>j.position))];
  const owners = [...new Set(jobPostings.map(j=>j.owner))];

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>Danh sách Tin tuyển dụng <span class="screen-tag">REC-01</span></h1>
        <div class="subtitle">Quản lý các tin tuyển dụng đang/đã đăng tuyển</div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" id="btnNewJob">+ Mới</button>
        <button class="btn" id="btnExportJob">⭳ Xuất Excel</button>
      </div>
    </div>

    <div class="search-bar">
      <div class="search-input-wrap">
        <input type="text" id="fJobKeyword" placeholder="Tìm theo mã, tiêu đề tin tuyển dụng…">
      </div>
      <select class="filter-select" id="fJobDept"><option value="">Phòng ban: Tất cả</option>${DEPARTMENTS.map(d=>`<option>${d}</option>`).join("")}</select>
      <select class="filter-select" id="fJobPosition"><option value="">Vị trí: Tất cả</option>${positions.map(p=>`<option>${p}</option>`).join("")}</select>
      <select class="filter-select" id="fJobStatus">
        <option value="">Trạng thái: Tất cả</option>
        <option value="draft">Nháp</option><option value="open">Đang tuyển</option>
        <option value="paused">Tạm dừng</option><option value="closed">Đã đóng</option>
      </select>
      <span class="filter-toggle" id="toggleJobFilter">⚙ Bộ lọc nâng cao</span>
    </div>
    <div class="filter-panel" id="jobFilterPanel">
      <div class="filter-field"><label>Người phụ trách</label>
        <select id="fJobOwner"><option value="">Tất cả</option>${owners.map(o=>`<option>${o}</option>`).join("")}</select>
      </div>
      <div class="filter-field"><label>Từ ngày bắt đầu</label><input type="date" id="fJobFrom"></div>
      <div class="filter-field"><label>Đến ngày bắt đầu</label><input type="date" id="fJobTo"></div>
    </div>

    <div class="list-card">
      <table class="o-table">
        <thead><tr>
          <th>Mã tuyển dụng</th><th>Tên tin tuyển dụng</th><th>Phòng ban</th><th>Vị trí</th>
          <th class="cell-num">SL cần tuyển</th><th class="cell-num">Đã tuyển</th><th class="cell-num">Đang tuyển</th>
          <th>Ngày bắt đầu</th><th>Ngày kết thúc</th><th>Người phụ trách</th><th>Trạng thái</th>
        </tr></thead>
        <tbody id="jobTableBody"></tbody>
      </table>
    </div>
  `);

  function paint(){
    const kw = (document.getElementById("fJobKeyword").value||"").toLowerCase();
    const dept = document.getElementById("fJobDept").value;
    const pos = document.getElementById("fJobPosition").value;
    const status = document.getElementById("fJobStatus").value;
    const owner = document.getElementById("fJobOwner").value;
    const from = document.getElementById("fJobFrom").value;
    const to = document.getElementById("fJobTo").value;

    const rows = jobPostings.filter(j=>{
      if(kw && !(j.code.toLowerCase().includes(kw) || j.title.toLowerCase().includes(kw))) return false;
      if(dept && j.dept!==dept) return false;
      if(pos && j.position!==pos) return false;
      if(status && j.status!==status) return false;
      if(owner && j.owner!==owner) return false;
      if(from && j.startDate < from) return false;
      if(to && j.startDate > to) return false;
      return true;
    });

    document.getElementById("jobTableBody").innerHTML = rows.length ? rows.map(j=>`
      <tr data-id="${j.id}">
        <td class="cell-strong">${j.code}</td>
        <td>${j.title}</td>
        <td>${j.dept}</td>
        <td>${j.position}</td>
        <td class="cell-num">${j.qty}</td>
        <td class="cell-num">${j.recruited}</td>
        <td class="cell-num">${j.recruiting}</td>
        <td>${fmtDate(j.startDate)}</td>
        <td>${j.endDate ? fmtDate(j.endDate) : "—"}</td>
        <td>${j.owner}</td>
        <td>${jobStatusBadge(j.status)}</td>
      </tr>`).join("") : `<tr><td colspan="11"><div class="empty-state">Không có tin tuyển dụng phù hợp bộ lọc.</div></td></tr>`;

    document.querySelectorAll("#jobTableBody tr[data-id]").forEach(tr=>{
      tr.addEventListener("click", ()=>navigate("job-form", tr.dataset.id));
    });
  }

  ["fJobKeyword","fJobDept","fJobPosition","fJobStatus","fJobOwner","fJobFrom","fJobTo"].forEach(id=>{
    document.getElementById(id).addEventListener("input", paint);
    document.getElementById(id).addEventListener("change", paint);
  });
  document.getElementById("toggleJobFilter").addEventListener("click", ()=>{
    document.getElementById("jobFilterPanel").classList.toggle("open");
  });
  document.getElementById("btnNewJob").addEventListener("click", ()=>navigate("job-form","new"));
  document.getElementById("btnExportJob").addEventListener("click", ()=>toast("Demo: hệ thống sẽ xuất danh sách tin tuyển dụng ra file Excel (.xlsx)."));

  paint();
}

function renderJobForm(id){
  const isNew = id==="new";
  const job = isNew ? {code:"(Tự động sinh)", title:"", dept:"", position:"", qty:"", startDate:"", endDate:"", owner:"", channel:"", description:"", requirement:"", benefit:"", status:"draft", note:""} : jobById(id);

  setBreadcrumb([{label:"Tuyển dụng"},{label:"Tin tuyển dụng", route:"job-list"},{label: isNew ? "Tin mới" : job.code}]);

  const relatedCandidates = isNew ? [] : candidates.filter(c=>c.jobId===job.id);

  const val = (v, ph="Chưa nhập")=> v ? v : `<span class="val empty">${ph}</span>`;

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>${isNew ? "Tin tuyển dụng mới" : job.title} <span class="screen-tag">REC-02</span></h1>
        <div class="subtitle">${isNew ? "Khai báo tin tuyển dụng mới" : "Mã: " + job.code}</div>
      </div>
      <div class="btn-row">
        <button class="btn" id="btnBackJob">← Danh sách</button>
        <button class="btn btn-primary" id="btnSaveJob">💾 Lưu</button>
      </div>
    </div>

    <div class="form-card">
      <div class="statusbar">
        ${["draft","open","paused","closed"].map(s=>{
          const labels = {draft:"Nháp",open:"Đang tuyển",paused:"Tạm dừng",closed:"Đã đóng"};
          const cls = s===job.status ? "current" : (["draft","open","paused","closed"].indexOf(s) < ["draft","open","paused","closed"].indexOf(job.status) ? "done":"");
          return `<div class="step ${cls}" data-status="${s}">${labels[s]}</div>`;
        }).join("")}
        <span style="margin-left:10px;">${info("Trạng thái tin tuyển dụng theo đặc tả mục 4.2: Nháp → Đang tuyển → Tạm dừng/Đã đóng. Bấm vào 1 bước để demo chuyển trạng thái.")}</span>
      </div>

      <div class="form-sheet">
        <h2>${isNew ? "Tin tuyển dụng mới" : job.title}</h2>
        <div class="sheet-sub">Mã tuyển dụng: ${job.code}</div>
        <div class="field-grid">
          <div class="field"><label>Tên tin tuyển dụng <span class="req">*</span></label><div class="val">${val(job.title)}</div></div>
          <div class="field"><label>Phòng ban <span class="req">*</span></label><div class="val">${val(job.dept)}</div></div>
          <div class="field"><label>Vị trí tuyển <span class="req">*</span></label><div class="val">${val(job.position)}</div></div>
          <div class="field"><label>Số lượng tuyển <span class="req">*</span></label><div class="val">${val(job.qty)}</div></div>
          <div class="field"><label>Ngày bắt đầu <span class="req">*</span></label><div class="val">${val(fmtDate(job.startDate))}</div></div>
          <div class="field"><label>Ngày kết thúc</label><div class="val">${val(fmtDate(job.endDate))}</div></div>
          <div class="field"><label>Người phụ trách <span class="req">*</span></label><div class="val">${val(job.owner)}</div></div>
          <div class="field"><label>Kênh đăng tuyển</label><div class="val">${val(job.channel)}</div></div>
          <div class="field full"><label>Mô tả công việc <span class="req">*</span></label><div class="val textarea">${val(job.description)}</div></div>
          <div class="field full"><label>Yêu cầu công việc <span class="req">*</span></label><div class="val textarea">${val(job.requirement)}</div></div>
          <div class="field full"><label>Quyền lợi</label><div class="val textarea">${val(job.benefit)}</div></div>
        </div>
      </div>

      <div class="tabs">
        <div class="tab-btn active" data-tab="t-cand">Danh sách ứng viên (${relatedCandidates.length})</div>
        <div class="tab-btn" data-tab="t-log">Nhật ký</div>
        <div class="tab-btn" data-tab="t-files">File đính kèm</div>
      </div>
      <div class="tab-content active" id="t-cand">
        ${relatedCandidates.length ? `<table class="o-table"><thead><tr><th>Mã ứng viên</th><th>Họ tên</th><th>Nguồn</th><th>Trạng thái</th></tr></thead>
        <tbody>${relatedCandidates.map(c=>`<tr data-cid="${c.id}"><td class="cell-strong">${c.code}</td><td>${c.name}</td><td>${c.source}</td><td>${candidateStatusBadge(c.status)}</td></tr>`).join("")}</tbody></table>`
        : `<div class="empty-state">Chưa có ứng viên nào ứng tuyển vào tin này.</div>`}
      </div>
      <div class="tab-content" id="t-log">
        <div class="timeline">
          <div class="t-item"><div class="t-marker"><span class="t-dot"></span><span class="t-line"></span></div><div class="t-body"><div class="t-date">${fmtDate(job.startDate)||"—"}</div><div class="t-label">${job.owner||"HCNS"} tạo tin tuyển dụng, trạng thái Nháp</div></div></div>
          <div class="t-item"><div class="t-marker"><span class="t-dot"></span></div><div class="t-body"><div class="t-date">—</div><div class="t-label">Chuyển trạng thái sang "${ {draft:"Nháp",open:"Đang tuyển",paused:"Tạm dừng",closed:"Đã đóng"}[job.status] }"</div></div></div>
        </div>
      </div>
      <div class="tab-content" id="t-files">
        <div class="empty-state">Cho phép đính kèm file mô tả công việc (JD), banner đăng tuyển… (demo)</div>
      </div>
    </div>
  `);

  document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
  document.querySelectorAll("#t-cand tr[data-cid]").forEach(tr=>{
    tr.addEventListener("click", ()=>navigate("candidate-form", tr.dataset.cid));
  });
  document.getElementById("btnBackJob").addEventListener("click", ()=>navigate("job-list"));
  document.getElementById("btnSaveJob").addEventListener("click", ()=>toast(isNew ? "Demo: đã tạo tin tuyển dụng mới (Nháp)." : "Demo: đã lưu thay đổi tin tuyển dụng."));
  document.querySelectorAll(".statusbar .step").forEach(step=>{
    step.addEventListener("click", ()=>{
      if(isNew) return;
      job.status = step.dataset.status;
      toast(`Demo: đã chuyển trạng thái tin tuyển dụng sang "${step.textContent}".`);
      renderJobForm(id);
    });
  });
}

/* ---------------- REC-03 / REC-04 — DATAPOOL ỨNG VIÊN ---------------- */

function renderCandidateList(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Datapool ứng viên"}]);

  const positions = [...new Set(candidates.map(c=>c.position))];

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>Datapool ứng viên <span class="screen-tag">REC-03</span></h1>
        <div class="subtitle">Kho dữ liệu ứng viên tập trung — lưu trữ, tra cứu, tái sử dụng hồ sơ</div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" id="btnNewCand">+ Thêm mới</button>
        <button class="btn" id="btnImportCV">⭱ Import CV</button>
        <button class="btn" id="btnExportCand">⭳ Export Excel</button>
      </div>
    </div>

    <div class="info-banner">
      ${info("Mục đích: giúp HCNS xây dựng nguồn ứng viên dài hạn, có thể khai thác lại khi phát sinh nhu cầu tuyển dụng mới — kể cả các ứng viên đã 'Không phù hợp' ở tin trước.")}
      <div><b>Datapool ứng viên</b>Toàn bộ ứng viên (kể cả đã từ chối) đều được lưu lại tại đây để tái sử dụng cho các đợt tuyển dụng sau.</div>
    </div>

    <div class="search-bar">
      <div class="search-input-wrap"><input type="text" id="fCandKw" placeholder="Tìm theo tên, SĐT, email…"></div>
      <select class="filter-select" id="fCandDept"><option value="">Phòng ban: Tất cả</option>${DEPARTMENTS.map(d=>`<option>${d}</option>`).join("")}</select>
      <select class="filter-select" id="fCandPos"><option value="">Vị trí: Tất cả</option>${positions.map(p=>`<option>${p}</option>`).join("")}</select>
      <select class="filter-select" id="fCandStatus">
        <option value="">Trạng thái: Tất cả</option>
        ${Object.entries(STAGE_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}
      </select>
      <span class="filter-toggle" id="toggleCandFilter">⚙ Bộ lọc nâng cao</span>
    </div>
    <div class="filter-panel" id="candFilterPanel">
      <div class="filter-field"><label>Nguồn ứng viên</label><select id="fCandSource"><option value="">Tất cả</option>${SOURCES.map(s=>`<option>${s}</option>`).join("")}</select></div>
      <div class="filter-field"><label>Người phụ trách</label><select id="fCandOwner"><option value="">Tất cả</option>${[...new Set(candidates.map(c=>c.owner))].map(o=>`<option>${o}</option>`).join("")}</select></div>
      <div class="filter-field"><label>Từ ngày tiếp nhận</label><input type="date" id="fCandFrom"></div>
      <div class="filter-field"><label>Đến ngày tiếp nhận</label><input type="date" id="fCandTo"></div>
    </div>

    <div class="list-card">
      <table class="o-table">
        <thead><tr>
          <th>Mã ứng viên</th><th>Họ tên</th><th>Điện thoại</th><th>Email</th><th>Nguồn</th>
          <th>Vị trí</th><th>Phòng ban</th><th>Tin tuyển dụng</th><th>Trạng thái</th><th>Người phụ trách</th><th>Ngày tiếp nhận</th>
        </tr></thead>
        <tbody id="candTableBody"></tbody>
      </table>
    </div>
  `);

  function paint(){
    const kw = (document.getElementById("fCandKw").value||"").toLowerCase();
    const dept = document.getElementById("fCandDept").value;
    const pos = document.getElementById("fCandPos").value;
    const status = document.getElementById("fCandStatus").value;
    const source = document.getElementById("fCandSource").value;
    const owner = document.getElementById("fCandOwner").value;
    const from = document.getElementById("fCandFrom").value;
    const to = document.getElementById("fCandTo").value;

    const rows = candidates.filter(c=>{
      if(kw && !(c.name.toLowerCase().includes(kw) || c.phone.includes(kw) || c.email.toLowerCase().includes(kw))) return false;
      if(dept && c.dept!==dept) return false;
      if(pos && c.position!==pos) return false;
      if(status && c.status!==status) return false;
      if(source && c.source!==source) return false;
      if(owner && c.owner!==owner) return false;
      if(from && c.receivedDate < from) return false;
      if(to && c.receivedDate > to) return false;
      return true;
    });

    document.getElementById("candTableBody").innerHTML = rows.length ? rows.map(c=>{
      const job = jobById(c.jobId);
      return `<tr data-id="${c.id}">
        <td class="cell-strong">${c.code}</td><td>${c.name}</td><td>${c.phone}</td><td>${c.email}</td>
        <td>${c.source}</td><td>${c.position}</td><td>${c.dept}</td><td>${job?job.code:"—"}</td>
        <td>${candidateStatusBadge(c.status)}</td><td>${c.owner}</td><td>${fmtDate(c.receivedDate)}</td>
      </tr>`;
    }).join("") : `<tr><td colspan="11"><div class="empty-state">Không có ứng viên phù hợp bộ lọc.</div></td></tr>`;

    document.querySelectorAll("#candTableBody tr[data-id]").forEach(tr=>{
      tr.addEventListener("click", ()=>navigate("candidate-form", tr.dataset.id));
    });
  }

  ["fCandKw","fCandDept","fCandPos","fCandStatus","fCandSource","fCandOwner","fCandFrom","fCandTo"].forEach(id=>{
    document.getElementById(id).addEventListener("input", paint);
    document.getElementById(id).addEventListener("change", paint);
  });
  document.getElementById("toggleCandFilter").addEventListener("click", ()=>{
    document.getElementById("candFilterPanel").classList.toggle("open");
  });
  document.getElementById("btnNewCand").addEventListener("click", ()=>navigate("candidate-form","new"));
  document.getElementById("btnImportCV").addEventListener("click", ()=>toast("Demo: mở hộp thoại Import CV (đọc thông tin từ file CV để tạo hồ sơ ứng viên tự động)."));
  document.getElementById("btnExportCand").addEventListener("click", ()=>toast("Demo: xuất danh sách ứng viên ra Excel."));

  paint();
}

function renderCandidateForm(id){
  const isNew = id==="new";
  const c = isNew ? {code:"(Tự động sinh)", name:"", dob:"", gender:"", phone:"", email:"", address:"", source:"", position:"", dept:"", jobId:null, owner:"", status:"new", receivedDate:"", round1:"", round2:"", round3:"", note:"", history:[]} : candidateById(id);
  const job = c.jobId ? jobById(c.jobId) : null;

  setBreadcrumb([{label:"Tuyển dụng"},{label:"Datapool ứng viên", route:"candidate-list"},{label: isNew ? "Ứng viên mới" : c.name}]);

  const val = (v, ph="Chưa nhập")=> v ? v : `<span class="val empty">${ph}</span>`;
  const isTerminal = c.status==="done" || c.status==="rejected";

  const stageSteps = STAGE_ORDER.map(s=>{
    let cls = "";
    if(c.status===s) cls = "current";
    else if(STAGE_ORDER.indexOf(s) < STAGE_ORDER.indexOf(c.status) || c.status==="rejected" ) cls = "done";
    if(c.status==="done" && s==="done") cls="terminal-good";
    return `<div class="step ${cls}" data-status="${s}">${STAGE_LABELS[s]}</div>`;
  }).join("");
  const rejectedStep = c.status==="rejected" ? `<div class="step terminal-bad current">${STAGE_LABELS.rejected}</div>` : "";

  const interviewRows = interviews.filter(iv=>iv.candidateId===c.id);
  const resultRows = interviewResults.filter(r=>r.candidateId===c.id);

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>${isNew ? "Ứng viên mới" : c.name} <span class="screen-tag">REC-04</span></h1>
        <div class="subtitle">${isNew ? "Tạo hồ sơ ứng viên mới vào Datapool" : "Mã ứng viên: " + c.code}</div>
      </div>
      <div class="btn-row">
        <button class="btn" id="btnBackCand">← Danh sách</button>
        <button class="btn" id="btnSendMail">✉ Gửi Email</button>
        ${!isNew && !isTerminal ? `<button class="btn btn-danger-outline" id="btnReject">✕ Không phù hợp</button>` : ""}
        <button class="btn btn-primary" id="btnSaveCand">💾 Lưu</button>
      </div>
    </div>

    <div class="form-card">
      <div class="statusbar">
        ${stageSteps}${rejectedStep}
        <span style="margin-left:10px;">${info("Statusbar minh họa quy trình tuyển dụng nhiều vòng (mục 3.2). Bấm vào bước kế tiếp để demo chuyển trạng thái — hệ thống sẽ tự gửi email tương ứng theo Workflow (REC-10).")}</span>
      </div>

      <div class="form-sheet">
        <h2>${isNew ? "Ứng viên mới" : c.name}</h2>
        <div class="sheet-sub">${isNew ? "" : `Ứng tuyển: ${c.position} — ${c.dept}${job? " — Tin: "+job.code:""}`}</div>
        <div class="field-grid">
          <div class="field"><label>Họ tên <span class="req">*</span></label><div class="val">${val(c.name)}</div></div>
          <div class="field"><label>Ngày sinh</label><div class="val">${val(fmtDate(c.dob))}</div></div>
          <div class="field"><label>Giới tính</label><div class="val">${val(c.gender)}</div></div>
          <div class="field"><label>Điện thoại <span class="req">*</span></label><div class="val">${val(c.phone)}</div></div>
          <div class="field"><label>Email <span class="req">*</span></label><div class="val">${val(c.email)}</div></div>
          <div class="field"><label>Địa chỉ</label><div class="val">${val(c.address)}</div></div>
          <div class="field"><label>Nguồn ứng viên</label><div class="val">${val(c.source)}</div></div>
          <div class="field"><label>Vị trí ứng tuyển <span class="req">*</span></label><div class="val">${val(c.position)}</div></div>
          <div class="field"><label>Phòng ban</label><div class="val">${val(c.dept)}</div></div>
          <div class="field"><label>Tin tuyển dụng</label><div class="val">${val(job?job.code+" — "+job.title:"")}</div></div>
          <div class="field"><label>Người phụ trách</label><div class="val">${val(c.owner)}</div></div>
          <div class="field"><label>Trạng thái <span class="req">*</span></label><div class="val">${candidateStatusBadge(c.status)}</div></div>
        </div>
      </div>

      <div class="tabs">
        <div class="tab-btn active" data-tab="t1">CV &amp; Hồ sơ</div>
        <div class="tab-btn" data-tab="t2">Lịch phỏng vấn (${interviewRows.length})</div>
        <div class="tab-btn" data-tab="t3">Đánh giá phỏng vấn (${resultRows.length})</div>
        <div class="tab-btn" data-tab="t4">Timeline</div>
      </div>

      <div class="tab-content active" id="t1">
        <div class="field-grid">
          ${["CV","Portfolio","Chứng chỉ","Bằng cấp","File khác"].map(f=>`
            <div class="field"><label>${f}</label><div class="val">${f==="CV" && !isNew ? `📄 CV_${c.code}.pdf` : `<span class="empty">Chưa có file</span>`}</div></div>
          `).join("")}
        </div>
        <p style="font-size:12px;color:var(--o-text-muted);margin-top:6px;">${info("Cho phép Upload nhiều file mỗi loại (mục REC-04 / Tab 2). Demo này chỉ hiển thị placeholder, không xử lý upload thật.")} Cho phép Upload nhiều file mỗi mục.</p>
      </div>

      <div class="tab-content" id="t2">
        ${interviewRows.length ? `<table class="o-table"><thead><tr><th>Vòng</th><th>Thời gian</th><th>Người phỏng vấn</th><th>Hình thức</th><th>Địa điểm</th><th>Trạng thái</th></tr></thead>
        <tbody>${interviewRows.map(iv=>`<tr><td>Vòng ${iv.round}</td><td>${fmtDate(iv.datetime)}</td><td>${iv.interviewer}</td><td>${iv.type}</td><td>${iv.location||iv.link||"—"}</td><td><span class="badge badge-info">${iv.status}</span></td></tr>`).join("")}</tbody></table>`
        : `<div class="empty-state">Chưa có lịch phỏng vấn nào.</div>`}
      </div>

      <div class="tab-content" id="t3">
        ${resultRows.length ? `<table class="o-table"><thead><tr><th>Vòng</th><th>Người đánh giá</th><th>Kết quả</th><th>Điểm</th><th>Nhận xét</th></tr></thead>
        <tbody>${resultRows.map(r=>`<tr><td>Vòng ${r.round}</td><td>${r.evaluator}</td><td>${r.result==="Đạt"?'<span class="badge badge-success">Đạt</span>':'<span class="badge badge-danger">Không đạt</span>'}</td><td>${r.score}</td><td>${r.comment}</td></tr>`).join("")}</tbody></table>`
        : `<div class="empty-state">Chưa có đánh giá phỏng vấn.</div>`}
      </div>

      <div class="tab-content" id="t4">
        ${c.history && c.history.length ? `<div class="timeline">${c.history.map(([d,label])=>`
          <div class="t-item"><div class="t-marker"><span class="t-dot"></span><span class="t-line"></span></div><div class="t-body"><div class="t-date">${d}</div><div class="t-label">${label}</div></div></div>
        `).join("")}</div>` : `<div class="empty-state">Chưa có lịch sử xử lý.</div>`}
      </div>
    </div>
  `);

  document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  document.getElementById("btnBackCand").addEventListener("click", ()=>navigate("candidate-list"));
  document.getElementById("btnSaveCand").addEventListener("click", ()=>toast(isNew ? "Demo: đã tạo hồ sơ ứng viên mới vào Datapool." : "Demo: đã lưu thay đổi hồ sơ ứng viên."));
  document.getElementById("btnSendMail").addEventListener("click", ()=>{
    if(isNew){ toast("Vui lòng lưu hồ sơ trước khi gửi email."); return; }
    toast(`Demo: đã gửi email cho ${c.name} (${c.email}) theo mẫu tương ứng trạng thái hiện tại.`);
  });

  const btnReject = document.getElementById("btnReject");
  if(btnReject) btnReject.addEventListener("click", ()=>{
    c.status = "rejected";
    toast(`Demo: hồ sơ chuyển "Không phù hợp" → tự động gửi email cảm ơn cho ${c.name}. Hồ sơ vẫn được giữ lại trong Datapool để khai thác sau.`);
    renderCandidateForm(id);
  });

  document.querySelectorAll(".statusbar .step").forEach(step=>{
    step.addEventListener("click", ()=>{
      if(isNew) return;
      const target = step.dataset.status;
      if(!target || target===c.status) return;
      c.status = target;
      let msg = `Demo: chuyển trạng thái ứng viên sang "${STAGE_LABELS[target]}".`;
      if(["interview1","interview2","interview3"].includes(target)) msg += ` → Tự động gửi email mời phỏng vấn cho ứng viên + thông báo người phỏng vấn (theo REC-10).`;
      if(target==="done") msg += ` → Tự động gửi thư mời nhận việc (Offer).`;
      toast(msg);
      renderCandidateForm(id);
    });
  });
}

/* ---------------- KANBAN — QUY TRÌNH TUYỂN DỤNG ---------------- */

function initials(name){
  const parts = name.trim().split(" ");
  return (parts[parts.length-1][0]||"") + (parts.length>1? (parts[0][0]||"") : "");
}

function renderPipeline(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Quy trình tuyển dụng (Kanban)"}]);

  const columns = [...STAGE_ORDER, "rejected"];

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>Quy trình tuyển dụng — Kanban <span class="screen-tag">Workflow</span></h1>
        <div class="subtitle">Theo dõi trực quan toàn bộ ứng viên đang ở từng bước quy trình (mục 3.2 / 5.1)</div>
      </div>
    </div>
    <div class="info-banner">
      ${info("Kéo thả thẻ ứng viên sang cột khác để demo chuyển bước quy trình. Mỗi lần chuyển bước, hệ thống sẽ tự gửi email/notification tương ứng theo cấu hình ở REC-10.")}
      <div><b>Cách dùng</b>Kéo (drag) một thẻ ứng viên sang cột khác để mô phỏng việc HCNS/Người phỏng vấn cập nhật bước quy trình. Bấm vào thẻ để mở hồ sơ chi tiết (REC-04).</div>
    </div>
    <div class="kanban-board" id="kanbanBoard">
      ${columns.map(col=>`
        <div class="kanban-col" data-col="${col}">
          <div class="kanban-col-head">${STAGE_LABELS[col]} <span class="count">${candidates.filter(c=>c.status===col).length}</span></div>
          <div class="kanban-col-cards" data-col-cards="${col}"></div>
        </div>
      `).join("")}
    </div>
  `);

  function paint(){
    columns.forEach(col=>{
      const list = candidates.filter(c=>c.status===col);
      document.querySelector(`.kanban-col[data-col="${col}"] .count`).textContent = list.length;
      const wrap = document.querySelector(`[data-col-cards="${col}"]`);
      wrap.innerHTML = list.map(c=>`
        <div class="kanban-card" draggable="true" data-id="${c.id}">
          <div class="k-name">${c.name}</div>
          <div class="k-pos">${c.position}</div>
          <div class="k-foot">
            <span class="k-avatar">${initials(c.name)}</span>
            <span class="k-tag">${c.dept}</span>
          </div>
        </div>
      `).join("");

      wrap.querySelectorAll(".kanban-card").forEach(card=>{
        card.addEventListener("click", ()=>navigate("candidate-form", card.dataset.id));
        card.addEventListener("dragstart", (e)=>{
          e.dataTransfer.setData("text/plain", card.dataset.id);
          setTimeout(()=>card.style.opacity="0.4",0);
        });
        card.addEventListener("dragend", ()=>{ card.style.opacity="1"; });
      });
    });
  }

  document.querySelectorAll(".kanban-col").forEach(colEl=>{
    colEl.addEventListener("dragover", (e)=>e.preventDefault());
    colEl.addEventListener("drop", (e)=>{
      e.preventDefault();
      const cid = e.dataTransfer.getData("text/plain");
      const cand = candidateById(cid);
      const newCol = colEl.dataset.col;
      if(!cand || cand.status===newCol) return;
      cand.status = newCol;
      let msg = `Demo: ${cand.name} chuyển sang bước "${STAGE_LABELS[newCol]}".`;
      if(["interview1","interview2","interview3"].includes(newCol)) msg += " → Gửi email mời phỏng vấn + thông báo người phỏng vấn.";
      if(newCol==="rejected") msg += " → Gửi email cảm ơn.";
      if(newCol==="done") msg += " → Gửi thư mời nhận việc (Offer).";
      toast(msg);
      paint();
    });
  });

  paint();
}

/* ---------------- REC-05 — LỊCH PHỎNG VẤN ---------------- */

function renderInterviewList(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Lịch phỏng vấn"}]);

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>Lịch phỏng vấn <span class="screen-tag">REC-05</span></h1>
        <div class="subtitle">Quản lý lịch phỏng vấn từng vòng cho ứng viên</div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" id="btnNewInterview">+ Tạo lịch phỏng vấn</button>
      </div>
    </div>

    <div class="info-banner">
      ${info("Sau khi Lưu lịch phỏng vấn, hệ thống TỰ ĐỘNG: (1) gửi email mời phỏng vấn cho ứng viên theo mẫu REC-09, (2) gửi email/thông báo cho người phỏng vấn kèm CV, (3) tạo Notification trong hệ thống — đúng theo mục 6.1/6.2 của đặc tả.")}
      <div><b>Tự động sau khi lưu</b>✓ Gửi email ứng viên &nbsp; ✓ Gửi email người phỏng vấn &nbsp; ✓ Tạo Notification</div>
    </div>

    <div class="list-card">
      <table class="o-table">
        <thead><tr>
          <th>Ứng viên</th><th>Vòng</th><th>Thời gian</th><th>Hình thức</th><th>Địa điểm/Link</th>
          <th>Người phỏng vấn</th><th>Trạng thái</th><th>Thao tác</th>
        </tr></thead>
        <tbody id="ivTableBody"></tbody>
      </table>
    </div>
  `);

  function paint(){
    document.getElementById("ivTableBody").innerHTML = interviews.map(iv=>{
      const cand = candidateById(iv.candidateId);
      const statusCls = iv.status==="Đã gửi mời" ? "badge-success" : iv.status==="Chưa gửi mời" ? "badge-draft" : "badge-info";
      return `<tr data-id="${iv.id}">
        <td class="cell-strong cand-link" data-cid="${cand.id}">${cand.name}</td>
        <td>Vòng ${iv.round}</td>
        <td>${fmtDate(iv.datetime)}</td>
        <td>${iv.type}</td>
        <td>${iv.location || iv.link || "—"}</td>
        <td>${iv.interviewer}</td>
        <td><span class="badge ${statusCls}">${iv.status}</span></td>
        <td>
          <div class="btn-row">
            <button class="btn btn-sm" data-act="send" data-id="${iv.id}">✉ Gửi thư mời</button>
            <button class="btn btn-sm" data-act="print" data-id="${iv.id}">🖶 In lịch</button>
          </div>
        </td>
      </tr>`;
    }).join("");

    document.querySelectorAll(".cand-link").forEach(el=>el.addEventListener("click",(e)=>{e.stopPropagation(); navigate("candidate-form", el.dataset.cid);}));
    document.querySelectorAll('[data-act="send"]').forEach(btn=>btn.addEventListener("click", ()=>{
      const iv = interviews.find(x=>x.id==btn.dataset.id);
      const cand = candidateById(iv.candidateId);
      iv.status = "Đã gửi mời";
      toast(`Demo: đã gửi thư mời PV vòng ${iv.round} cho ${cand.name}, thông báo cho ${iv.interviewer}, và tạo Notification.`);
      paint();
    }));
    document.querySelectorAll('[data-act="print"]').forEach(btn=>btn.addEventListener("click", ()=>toast("Demo: xuất lịch phỏng vấn dạng PDF để in.")));
  }
  paint();

  document.getElementById("btnNewInterview").addEventListener("click", ()=>{
    const candOptions = candidates.filter(c=>!["done","rejected"].includes(c.status))
      .map(c=>`<option value="${c.id}">${c.code} — ${c.name}</option>`).join("");
    openModal("Tạo lịch phỏng vấn", `
      <div class="field-grid">
        <div class="field full"><label>Ứng viên <span class="req">*</span></label>
          <select id="mIvCand">${candOptions}</select></div>
        <div class="field"><label>Vòng phỏng vấn <span class="req">*</span></label>
          <select id="mIvRound"><option value="1">Vòng 1</option><option value="2">Vòng 2</option><option value="3">Vòng 3</option></select></div>
        <div class="field"><label>Ngày giờ <span class="req">*</span></label><input type="datetime-local" id="mIvDatetime"></div>
        <div class="field"><label>Hình thức</label>
          <select id="mIvType"><option>Offline</option><option>Online</option></select></div>
        <div class="field"><label>Người phỏng vấn <span class="req">*</span></label><input type="text" id="mIvInterviewer" placeholder="VD: Trần Văn Long"></div>
        <div class="field full"><label>Địa điểm / Link Meeting</label><input type="text" id="mIvPlace" placeholder="Phòng họp... hoặc link Google Meet/Zoom"></div>
        <div class="field full"><label>Ghi chú</label><input type="text" id="mIvNote" placeholder="Ghi chú cho người phỏng vấn"></div>
      </div>
      <div class="warn-box" style="margin-top:14px;">
        <b>Sau khi lưu, hệ thống sẽ tự động:</b>
        ✓ gửi email mời phỏng vấn cho ứng viên &nbsp;|&nbsp; ✓ gửi email/thông báo cho người phỏng vấn &nbsp;|&nbsp; ✓ tạo Notification trong hệ thống.
      </div>
    `, `<button class="btn" id="mCancel">Hủy</button><button class="btn btn-primary" id="mSave">💾 Lưu &amp; Gửi thư mời</button>`);

    document.getElementById("mCancel").addEventListener("click", closeModal);
    document.getElementById("mSave").addEventListener("click", ()=>{
      const candId = Number(document.getElementById("mIvCand").value);
      const cand = candidateById(candId);
      const round = Number(document.getElementById("mIvRound").value);
      if(!cand){ toast("Vui lòng chọn ứng viên."); return; }
      interviews.unshift({
        id: Date.now(), candidateId: candId, round,
        datetime: (document.getElementById("mIvDatetime").value||"").replace("T"," ") || "Chưa xác định",
        type: document.getElementById("mIvType").value,
        location: document.getElementById("mIvType").value==="Offline" ? document.getElementById("mIvPlace").value : "",
        link: document.getElementById("mIvType").value==="Online" ? document.getElementById("mIvPlace").value : "",
        interviewer: document.getElementById("mIvInterviewer").value || "Chưa phân công",
        supporter:"", note: document.getElementById("mIvNote").value, status:"Đã gửi mời"
      });
      cand.status = round===1 ? "interview1" : round===2 ? "interview2" : "interview3";
      closeModal();
      toast(`Demo: đã tạo lịch PV vòng ${round} cho ${cand.name} → tự động gửi email ứng viên, thông báo người phỏng vấn, tạo Notification.`);
      renderInterviewList();
    });
  });
}

/* ---------------- REC-06 — KẾT QUẢ PHỎNG VẤN ---------------- */

function renderInterviewResult(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Kết quả phỏng vấn"}]);

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>Kết quả phỏng vấn <span class="screen-tag">REC-06</span></h1>
        <div class="subtitle">Ghi nhận đánh giá ứng viên sau mỗi vòng phỏng vấn</div>
      </div>
      <div class="btn-row"><button class="btn btn-primary" id="btnNewResult">+ Nhập kết quả</button></div>
    </div>

    <div class="flow-strip">
      <span class="fnode">Phỏng vấn xong</span><span class="farrow">→</span>
      <span class="fnode good">Đạt → Chuyển vòng tiếp / Hoàn thành</span>
      <span class="farrow">hoặc</span>
      <span class="fnode bad">Không đạt → Gửi email cảm ơn</span>
      ${info("Quy tắc rẽ nhánh theo mục 3.2 và REC-06: kết quả 'Đạt' sẽ chuyển ứng viên sang vòng phỏng vấn tiếp theo (hoặc Hoàn thành tuyển dụng nếu là vòng cuối); kết quả 'Không đạt' chuyển trạng thái 'Không phù hợp' và tự động gửi thư cảm ơn.")}
    </div>

    <div class="list-card">
      <table class="o-table">
        <thead><tr><th>Ứng viên</th><th>Vòng</th><th>Người đánh giá</th><th class="cell-num">Điểm</th><th>Kết quả</th><th>Nhận xét</th></tr></thead>
        <tbody id="resTableBody"></tbody>
      </table>
    </div>
  `);

  function paint(){
    document.getElementById("resTableBody").innerHTML = interviewResults.map(r=>{
      const cand = candidateById(r.candidateId);
      const cls = r.result==="Đạt" ? "badge-success" : r.result==="Không đạt" ? "badge-danger" : r.result==="Chờ" ? "badge-draft" : "badge-progress";
      return `<tr>
        <td class="cell-strong cand-link" data-cid="${cand.id}">${cand.name}</td>
        <td>Vòng ${r.round}</td><td>${r.evaluator}</td><td class="cell-num">${r.score}</td>
        <td><span class="badge ${cls}">${r.result}</span></td><td>${r.comment}</td>
      </tr>`;
    }).join("");
    document.querySelectorAll(".cand-link").forEach(el=>el.addEventListener("click", ()=>navigate("candidate-form", el.dataset.cid)));
  }
  paint();

  document.getElementById("btnNewResult").addEventListener("click", ()=>{
    const candOptions = candidates.filter(c=>c.status.startsWith("interview")).map(c=>`<option value="${c.id}">${c.code} — ${c.name} (${STAGE_LABELS[c.status]})</option>`).join("");
    openModal("Nhập kết quả phỏng vấn", `
      <div class="field-grid">
        <div class="field full"><label>Ứng viên <span class="req">*</span></label><select id="mResCand">${candOptions || '<option value="">Không có ứng viên đang phỏng vấn</option>'}</select></div>
        <div class="field"><label>Người đánh giá <span class="req">*</span></label><input type="text" id="mResEval" placeholder="VD: Trần Văn Long"></div>
        <div class="field"><label>Điểm</label><input type="number" id="mResScore" min="0" max="10" step="0.5"></div>
        <div class="field full"><label>Kết quả <span class="req">*</span></label>
          <select id="mResResult"><option value="Đạt">Đạt</option><option value="Không đạt">Không đạt</option><option value="Chờ">Chờ phản hồi</option><option value="Hẹn lại">Cần phỏng vấn thêm / Hẹn lại</option></select>
        </div>
        <div class="field full"><label>Nhận xét</label><input type="text" id="mResComment" placeholder="Ghi chú đánh giá ứng viên"></div>
      </div>
      <div class="warn-box" id="mResHint" style="margin-top:14px;">Chọn kết quả để xem hành động tự động tương ứng.</div>
    `, `<button class="btn" id="mCancel">Hủy</button><button class="btn btn-primary" id="mSave">💾 Lưu kết quả</button>`);

    const hint = document.getElementById("mResHint");
    function updateHint(){
      const v = document.getElementById("mResResult").value;
      if(v==="Đạt") hint.innerHTML = "<b>Nếu Đạt:</b> hệ thống tự động chuyển ứng viên sang vòng phỏng vấn tiếp theo, hoặc 'Hoàn thành tuyển dụng' nếu đây là vòng cuối — kèm gửi thư mời nhận việc (Offer).";
      else if(v==="Không đạt"){ hint.classList.add("danger"); hint.innerHTML = "<b>Nếu Không đạt:</b> hệ thống chuyển trạng thái 'Không phù hợp' và tự động gửi Email cảm ơn cho ứng viên. Hồ sơ vẫn lưu trong Datapool."; }
      else { hint.classList.remove("danger"); hint.innerHTML = "Trạng thái chờ — không kích hoạt email tự động, HCNS cần theo dõi và cập nhật lại sau."; }
      if(v!=="Không đạt") hint.classList.remove("danger");
    }
    document.getElementById("mResResult").addEventListener("change", updateHint);
    updateHint();

    document.getElementById("mCancel").addEventListener("click", closeModal);
    document.getElementById("mSave").addEventListener("click", ()=>{
      const candId = Number(document.getElementById("mResCand").value);
      const cand = candidateById(candId);
      if(!cand){ toast("Không có ứng viên hợp lệ để nhập kết quả."); return; }
      const result = document.getElementById("mResResult").value;
      const round = cand.status==="interview1"?1:cand.status==="interview2"?2:3;
      interviewResults.unshift({id:Date.now(), candidateId:candId, round, evaluator: document.getElementById("mResEval").value||"Chưa rõ", score: Number(document.getElementById("mResScore").value)||0, result, comment: document.getElementById("mResComment").value});

      let msg = "";
      if(result==="Đạt"){
        if(round<3){ cand.status = round===1?"interview2":"interview3"; msg = `${cand.name} Đạt vòng ${round} → chuyển sang Hẹn PV vòng ${round+1}, tự động gửi email mời.`; }
        else { cand.status="done"; msg = `${cand.name} Đạt vòng cuối → Hoàn thành tuyển dụng, tự động gửi thư Offer.`; }
      } else if(result==="Không đạt"){
        cand.status="rejected"; msg = `${cand.name} Không đạt vòng ${round} → chuyển Không phù hợp, tự động gửi email cảm ơn.`;
      } else {
        msg = `Đã ghi nhận kết quả "${result}" cho ${cand.name}, chưa chuyển bước.`;
      }
      closeModal();
      toast("Demo: " + msg);
      renderInterviewResult();
    });
  });
}

/* ---------------- REC-07 — ĐỊNH BIÊN TUYỂN DỤNG ---------------- */

function renderHeadcount(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Định biên tuyển dụng"}]);

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>Định biên tuyển dụng <span class="screen-tag">REC-07</span></h1>
        <div class="subtitle">Kiểm soát số lượng tuyển theo định biên/phê duyệt trước khi triển khai tuyển dụng thực tế</div>
      </div>
    </div>

    <div class="info-banner">
      ${info("<b>Công thức:</b> Số lượng còn thiếu = Định biên − Nhân sự hiện có − Số lượng đang tuyển.<br>Nếu kết quả &lt; 0 → 🔴 Vượt định biên. Nếu = 0 → 🟡 Sắp đủ. Nếu &gt; 0 → 🟢 Bình thường.<br>Hệ thống còn kiểm tra thêm: Số lượng đang tuyển có vượt Số lượng đã được phê duyệt tuyển hay không (Đề xuất tuyển dụng).")}
      <div><b>Logic cảnh báo định biên</b>Còn thiếu = Định biên − Hiện có − Đang tuyển. Tính năng này CHỈ CẢNH BÁO, không chặn thao tác (giai đoạn đầu) — trừ khi sau này cấu hình bắt buộc chặn (mục 7.3).</div>
    </div>

    <div class="list-card">
      <table class="o-table">
        <thead><tr>
          <th>Phòng ban</th><th>Vị trí</th><th class="cell-num">Định biên</th><th class="cell-num">Hiện có</th>
          <th class="cell-num">Đã duyệt tuyển</th><th class="cell-num">Đang tuyển</th><th class="cell-num">Đã tuyển</th>
          <th class="cell-num">Còn thiếu</th><th>Trạng thái</th><th>Thao tác</th>
        </tr></thead>
        <tbody>
          ${headcount.map((h,i)=>`
            <tr>
              <td>${h.dept}</td><td class="cell-strong">${h.position}</td>
              <td class="cell-num">${h.quota}</td><td class="cell-num">${h.current}</td>
              <td class="cell-num">${h.approved}</td><td class="cell-num">${h.recruiting}</td><td class="cell-num">${h.recruited}</td>
              <td class="cell-num" style="${h.shortage<0?'color:var(--s-danger);font-weight:700;':''}">${h.shortage}</td>
              <td>${headcountDot(h.color)}</td>
              <td><button class="btn btn-sm" data-act="approve" data-idx="${i}">Đồng ý tuyển dụng</button></td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `);

  document.querySelectorAll('[data-act="approve"]').forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const h = headcount[btn.dataset.idx];
      checkHeadcountWarning(h);
    });
  });
}

function checkHeadcountWarning(h){
  const overQuota = h.color==="red";
  const overApproved = h.overApproved;
  if(!overQuota && !overApproved){
    openModal("Kiểm tra định biên", `
      <div class="warn-box" style="background:#e4f5e9;border-color:#cdeada;color:#1d6b3a;">
        <b>✓ Hợp lệ</b>Vị trí <b>${h.position}</b> (${h.dept}) vẫn còn ${h.shortage} chỉ tiêu trong định biên. Có thể tiếp tục triển khai tuyển dụng.
      </div>
    `, `<button class="btn btn-primary" id="mOk">Đóng</button>`);
    document.getElementById("mOk").addEventListener("click", closeModal);
    return;
  }
  let warnings = "";
  if(overQuota) warnings += `<div class="warn-box danger"><b>⚠ Vượt định biên</b>"Vị trí/phòng ban này đã đủ hoặc vượt định biên. Vui lòng kiểm tra lại nhu cầu tuyển dụng đã được phê duyệt trước khi triển khai tuyển."</div>`;
  if(overApproved) warnings += `<div class="warn-box danger"><b>⚠ Vượt số lượng phê duyệt</b>"Số lượng đang tuyển (${h.recruiting}) vượt số lượng được phê duyệt trong đề xuất tuyển dụng (${h.approved})."</div>`;
  warnings += `<p style="font-size:12.5px;color:var(--o-text-muted);margin-top:10px;">${info("Theo mục 7.3: giai đoạn đầu hệ thống CHỈ CẢNH BÁO, HCNS vẫn có thể bấm 'Vẫn tiếp tục' để triển khai tuyển dụng. Có thể cấu hình chặn cứng (bắt buộc) ở giai đoạn sau.")} Đây là cảnh báo (popup), không tự động chặn thao tác.</p>`;

  openModal("⚠ Cảnh báo định biên tuyển dụng", warnings,
    `<button class="btn" id="mCancelHc">Hủy</button><button class="btn btn-primary" id="mProceedHc">Vẫn tiếp tục</button>`);
  document.getElementById("mCancelHc").addEventListener("click", closeModal);
  document.getElementById("mProceedHc").addEventListener("click", ()=>{
    closeModal();
    toast(`Demo: HCNS xác nhận vẫn tiếp tục triển khai tuyển dụng cho ${h.position} dù có cảnh báo định biên.`);
  });
}

/* ---------------- REC-09 — EMAIL TEMPLATE ---------------- */

function renderEmailTemplates(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Cấu hình"},{label:"Email Template"}]);

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>Email Template <span class="screen-tag">REC-09</span></h1>
        <div class="subtitle">Quản lý mẫu email tự động gửi trong quy trình tuyển dụng (mục 6)</div>
      </div>
    </div>
    <div class="list-card">
      <table class="o-table">
        <thead><tr><th>Mã mẫu</th><th>Tên mẫu email</th><th>Trigger (Điều kiện gửi)</th><th>Tiêu đề email</th></tr></thead>
        <tbody>
          ${emailTemplates.map(t=>`
            <tr data-id="${t.id}">
              <td class="cell-strong">${t.code}</td><td>${t.name}</td><td>${t.trigger}</td><td>${t.subject}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `);
  document.querySelectorAll("tr[data-id]").forEach(tr=>tr.addEventListener("click", ()=>navigate("email-template-form", tr.dataset.id)));
}

function renderEmailTemplateForm(id){
  const t = emailTemplates.find(x=>x.id===Number(id));
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Cấu hình"},{label:"Email Template", route:"email-templates"},{label:t.name}]);

  const highlightedBody = t.body.replace(/\{\{(.*?)\}\}/g, '<b style="color:var(--o-primary);">{{$1}}</b>').replace(/\n/g,"<br>");

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>${t.name} <span class="screen-tag">REC-09</span></h1>
        <div class="subtitle">Mã mẫu: ${t.code}</div>
      </div>
      <div class="btn-row">
        <button class="btn" id="btnBackTpl">← Danh sách</button>
        <button class="btn btn-primary" id="btnSaveTpl">💾 Lưu</button>
      </div>
    </div>
    <div class="form-card">
      <div class="form-sheet">
        <div class="field-grid">
          <div class="field full"><label>Trigger — Điều kiện gửi ${info("Email được kích hoạt tự động theo workflow cấu hình tại REC-10, không cần thao tác thủ công.")}</label><div class="val">${t.trigger}</div></div>
          <div class="field full"><label>Tiêu đề email</label><div class="val">${t.subject}</div></div>
          <div class="field full"><label>Nội dung email ${info("Các biến động {{...}} sẽ được hệ thống tự thay thế bằng dữ liệu thực tế của ứng viên/lịch phỏng vấn khi gửi (mục 6.1/6.2).")}</label>
            <div class="val textarea" style="font-family:monospace;font-size:12.5px;">${highlightedBody}</div>
          </div>
        </div>
      </div>
    </div>
  `);
  document.getElementById("btnBackTpl").addEventListener("click", ()=>navigate("email-templates"));
  document.getElementById("btnSaveTpl").addEventListener("click", ()=>toast("Demo: đã lưu thay đổi mẫu email."));
}

/* ---------------- REC-10 — CẤU HÌNH WORKFLOW ---------------- */

function renderWorkflowConfig(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Cấu hình"},{label:"Cấu hình Workflow"}]);

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>Cấu hình Workflow tuyển dụng <span class="screen-tag">REC-10</span></h1>
        <div class="subtitle">Admin cấu hình các bước trong quy trình tuyển dụng và hành vi tự động của từng bước</div>
      </div>
    </div>

    <div class="info-banner">
      ${info("Mỗi bước có thể bật/tắt: gửi Email, gửi Notification, bắt buộc nhập đánh giá trước khi qua bước, và tự động chuyển bước kế tiếp khi đủ điều kiện. Đây là cấu hình nền cho toàn bộ logic tự động ở REC-04/05/06.")}
      <div><b>Lưu ý</b>Thay đổi cấu hình tại đây sẽ ảnh hưởng đến hành vi tự động (gửi email/thông báo) của toàn bộ quy trình tuyển dụng đang chạy.</div>
    </div>

    <div class="list-card">
      <table class="o-table">
        <thead><tr><th class="cell-num">Thứ tự</th><th>Tên bước</th><th>Gửi Email</th><th>Gửi Notification</th><th>Bắt buộc đánh giá</th><th>Tự động chuyển bước</th></tr></thead>
        <tbody>
          ${workflowSteps.map((s,i)=>`
            <tr>
              <td class="cell-num">${s.order}</td><td class="cell-strong">${s.name}</td>
              <td>${toggle(s, "sendEmail", i)}</td>
              <td>${toggle(s, "sendNotification", i)}</td>
              <td>${toggle(s, "requireEval", i)}</td>
              <td>${toggle(s, "autoNext", i)}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>

    <div class="chart-card" style="margin-top:16px;">
      <h3>Sơ đồ luồng (ví dụ minh họa mục 5.1)</h3>
      <div class="flow-strip">
        <span class="fnode">Tiếp nhận CV</span><span class="farrow">→</span>
        <span class="fnode">Process</span><span class="farrow">→</span>
        <span class="fnode">PV1</span><span class="farrow">→</span>
        <span class="fnode">PV2</span><span class="farrow">→</span>
        <span class="fnode">PV3</span><span class="farrow">→</span>
        <span class="fnode good">Đạt</span><span class="farrow">→</span>
        <span class="fnode good">Hoàn thành</span>
      </div>
      <div class="flow-strip">
        <span class="farrow">Hoặc tại bất kỳ vòng PV nào:</span>
        <span class="fnode bad">Không đạt</span><span class="farrow">→</span>
        <span class="fnode bad">Datapool (Không phù hợp)</span>
      </div>
    </div>
  `);

  document.querySelectorAll(".wf-toggle").forEach(el=>{
    el.addEventListener("click", ()=>{
      const step = workflowSteps[Number(el.dataset.idx)];
      const key = el.dataset.key;
      step[key] = !step[key];
      toast(`Demo: ${step[key] ? "Bật" : "Tắt"} "${labelFor(key)}" cho bước "${step.name}".`);
      renderWorkflowConfig();
    });
  });
}

function labelFor(key){
  return {sendEmail:"Gửi Email", sendNotification:"Gửi Notification", requireEval:"Bắt buộc nhập đánh giá", autoNext:"Tự động chuyển bước"}[key];
}

function toggle(step, key, idx){
  const on = step[key];
  return `<span class="badge ${on?'badge-success':'badge-draft'} wf-toggle" style="cursor:pointer;" data-idx="${idx}" data-key="${key}">${on?"✓ Có":"✕ Không"}</span>`;
}

/* ---------------- TỔNG QUAN MODULE (overview cho DEV) ---------------- */

const SCREENS = [
  {code:"REC-01", name:"Danh sách Tin tuyển dụng", route:"job-list", desc:"Quản lý các tin tuyển dụng"},
  {code:"REC-02", name:"Chi tiết Tin tuyển dụng", route:null, desc:"Khai báo thông tin tuyển dụng (mở từ REC-01)"},
  {code:"REC-03", name:"Datapool ứng viên", route:"candidate-list", desc:"Quản lý kho ứng viên"},
  {code:"REC-04", name:"Chi tiết ứng viên", route:null, desc:"Quản lý toàn bộ hồ sơ ứng viên (mở từ REC-03)"},
  {code:"REC-05", name:"Lịch phỏng vấn", route:"interview-list", desc:"Quản lý lịch phỏng vấn"},
  {code:"REC-06", name:"Kết quả phỏng vấn", route:"interview-result", desc:"Đánh giá ứng viên"},
  {code:"REC-07", name:"Định biên tuyển dụng", route:"headcount", desc:"Quản lý định biên"},
  {code:"REC-08", name:"Dashboard tuyển dụng", route:"dashboard", desc:"Theo dõi tình hình tuyển dụng"},
  {code:"REC-09", name:"Email Template", route:"email-templates", desc:"Quản lý mẫu email"},
  {code:"REC-10", name:"Cấu hình Workflow", route:"workflow-config", desc:"Cấu hình quy trình tuyển dụng"}
];

function openOverviewModal(){
  openModal("📘 Tổng quan Module Tuyển dụng — Naga ERP", `
    <div class="ov-section">
      <h3>1. Mục đích module</h3>
      <p>Quản lý tập trung toàn bộ dữ liệu ứng viên, quy trình tuyển dụng, lịch phỏng vấn, kết quả phỏng vấn và kiểm soát nhu cầu tuyển dụng theo định biên/phê duyệt.</p>
    </div>

    <div class="ov-section">
      <h3>2. Đối tượng sử dụng</h3>
      <div class="ov-grid">
        <div><b>HCNS / Tuyển dụng</b><ul><li>Tạo tin, tiếp nhận CV, quản lý Datapool</li><li>Sắp xếp lịch PV, cập nhật trạng thái</li><li>Gửi email/thông báo</li></ul></div>
        <div><b>Trưởng phòng / Người phỏng vấn</b><ul><li>Nhận lịch PV</li><li>Xem hồ sơ ứng viên</li><li>Cập nhật kết quả PV</li></ul></div>
        <div><b>Ban lãnh đạo / Quản lý</b><ul><li>Xem báo cáo tuyển dụng</li><li>Kiểm soát theo định biên</li></ul></div>
        <div><b>Admin hệ thống</b><ul><li>Cấu hình phòng ban, vị trí, định biên</li><li>Cấu hình email, workflow</li></ul></div>
      </div>
    </div>

    <div class="ov-section">
      <h3>3. Phạm vi nghiệp vụ — 3 nhóm chức năng chính</h3>
      <ul>
        <li><b>Datapool ứng viên</b> — kho dữ liệu ứng viên tập trung, tái sử dụng lâu dài.</li>
        <li><b>Quy trình tuyển dụng</b> — luồng nhiều vòng phỏng vấn có tự động gửi email/thông báo.</li>
        <li><b>Kiểm tra định biên tuyển dụng</b> — cảnh báo (không chặn) khi vượt định biên/đề xuất đã duyệt.</li>
      </ul>
    </div>

    <div class="ov-section">
      <h3>4. Luồng nghiệp vụ chính</h3>
      <div class="flow-strip">
        <span class="fnode">Tiếp nhận CV</span><span class="farrow">→</span>
        <span class="fnode">Process hồ sơ</span><span class="farrow">→</span>
        <span class="fnode">PV vòng 1</span><span class="farrow">→</span>
        <span class="fnode">PV vòng 2</span><span class="farrow">→</span>
        <span class="fnode">PV vòng 3</span><span class="farrow">→</span>
        <span class="fnode good">Hoàn thành tuyển dụng</span>
      </div>
      <div class="flow-strip"><span class="farrow">Ở bất kỳ vòng nào, nếu không đạt:</span><span class="fnode bad">Không phù hợp</span><span class="farrow">→</span><span class="fnode bad">Gửi thư cảm ơn, lưu lại Datapool</span></div>
    </div>

    <div class="ov-section">
      <h3>5. Logic cảnh báo định biên (REC-07)</h3>
      <p><b>Còn thiếu = Định biên − Nhân sự hiện có − Số lượng đang tuyển.</b> Nếu &lt; 0 → cảnh báo Vượt định biên. Hệ thống cũng cảnh báo nếu Số lượng đang tuyển vượt Số lượng đã được phê duyệt trong đề xuất tuyển dụng. Đây chỉ là <b>cảnh báo (popup)</b>, không tự động chặn thao tác ở giai đoạn đầu.</p>
    </div>

    <div class="ov-section">
      <h3>6. Quy tắc gửi email/thông báo tự động</h3>
      <ul>
        <li><b>Thư mời phỏng vấn</b> — gửi ứng viên khi chuyển sang Hẹn PV vòng 1/2/3, kèm thông báo cho người phỏng vấn (có CV, ghi chú).</li>
        <li><b>Thư cảm ơn</b> — gửi tự động khi hồ sơ chuyển "Không phù hợp".</li>
        <li><b>Thư Offer</b> — gửi khi hồ sơ "Hoàn thành tuyển dụng".</li>
        <li>Toàn bộ trigger/nội dung có thể cấu hình tại <b>Email Template (REC-09)</b> và bật/tắt theo từng bước tại <b>Cấu hình Workflow (REC-10)</b>.</li>
      </ul>
    </div>

    <div class="ov-section">
      <h3>7. Danh sách 10 màn hình — bấm để mở nhanh</h3>
      <div class="screen-link-grid">
        ${SCREENS.map(s=>`
          <div class="screen-link" ${s.route?`data-route="${s.route}"`:""}>
            <b>${s.code} — ${s.name}</b>
            <span>${s.desc}</span>
          </div>`).join("")}
      </div>
    </div>
  `, `<button class="btn btn-primary" id="mCloseOv">Bắt đầu khám phá →</button>`);

  document.getElementById("mCloseOv").addEventListener("click", closeModal);
  document.querySelectorAll(".screen-link[data-route]").forEach(el=>{
    el.addEventListener("click", ()=>{ closeModal(); navigate(el.dataset.route); });
  });
}

/* ---------------- BÁO CÁO TUYỂN DỤNG (5 màn hình) ---------------- */

function reportToolbar(title, screenCode){
  return `
    <div class="view-toolbar">
      <div class="title-block">
        <h1>${title} <span class="screen-tag">${screenCode}</span></h1>
        <nav style="font-size:12px;color:var(--o-text-muted);margin-top:2px;">
          Tuyển dụng <span style="margin:0 4px">›</span> Báo cáo <span style="margin:0 4px">›</span> <b style="color:var(--o-text)">${title}</b>
        </nav>
      </div>
      <div class="btn-row">
        <button class="btn" onclick="this.blur();window.toast&&toast('Demo: xuất báo cáo ra Excel/PDF.')">⭳ Xuất Excel</button>
      </div>
    </div>`;
}

function reportFilter(fields=[]){
  const base = `
    <div class="search-bar" style="margin-bottom:14px;">
      <div class="filter-field"><label>Từ ngày</label><input type="date" class="rpt-from"></div>
      <div class="filter-field"><label>Đến ngày</label><input type="date" class="rpt-to"></div>`;
  const extra = fields.map(f=>{
    if(f==="dept") return `<div class="filter-field"><label>Phòng ban</label><select class="rpt-dept"><option value="">Tất cả</option>${DEPARTMENTS.map(d=>`<option>${d}</option>`).join("")}</select></div>`;
    if(f==="source") return `<div class="filter-field"><label>Nguồn</label><select class="rpt-source"><option value="">Tất cả</option>${SOURCES.map(s=>`<option>${s}</option>`).join("")}</select></div>`;
    if(f==="status") return `<div class="filter-field"><label>Trạng thái</label><select class="rpt-status"><option value="">Tất cả</option>${Object.entries(STAGE_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></div>`;
    return "";
  }).join("");
  return base + extra + `<button class="btn btn-primary rpt-apply" style="align-self:flex-end;">Áp dụng</button></div>`;
}

/* --- Report 1: Theo tháng --- */
function renderReportMonthly(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Báo cáo"},{label:"Theo tháng"}]);

  function build(list){
    const byMonth = {};
    list.forEach(c=>{
      const m = c.receivedDate.slice(0,7);
      if(!byMonth[m]) byMonth[m] = {total:0,processing:0,interview:0,done:0,rejected:0};
      byMonth[m].total++;
      if(c.status==="processing") byMonth[m].processing++;
      else if(c.status.startsWith("interview")) byMonth[m].interview++;
      else if(c.status==="done") byMonth[m].done++;
      else if(c.status==="rejected") byMonth[m].rejected++;
    });
    const months = Object.keys(byMonth).sort().reverse();
    if(!months.length) return `<div class="empty-state">Không có dữ liệu phù hợp.</div>`;
    const totDone = months.reduce((s,m)=>s+byMonth[m].done,0);
    const totAll  = months.reduce((s,m)=>s+byMonth[m].total,0);
    return `
      <div class="list-card"><table class="o-table">
        <thead><tr>
          <th>Tháng</th><th class="cell-num">Tổng CV</th><th class="cell-num">Đang Process</th>
          <th class="cell-num">Đang PV</th><th class="cell-num">Hoàn thành</th><th class="cell-num">Không phù hợp</th><th class="cell-num">Tỷ lệ đạt</th>
        </tr></thead>
        <tbody>
          ${months.map(m=>{
            const r = byMonth[m];
            const rate = r.total ? Math.round(r.done/r.total*100) : 0;
            return `<tr><td class="cell-strong">${m}</td><td class="cell-num">${r.total}</td><td class="cell-num">${r.processing}</td><td class="cell-num">${r.interview}</td>
              <td class="cell-num" style="color:var(--s-success)">${r.done}</td><td class="cell-num" style="color:var(--s-danger)">${r.rejected}</td>
              <td class="cell-num"><span class="badge ${rate>=60?"badge-success":rate>=30?"badge-progress":"badge-draft"}">${rate}%</span></td></tr>`;
          }).join("")}
        </tbody>
        <tfoot><tr style="font-weight:700;background:#fafafa;">
          <td>Tổng</td><td class="cell-num">${totAll}</td><td class="cell-num" colspan="2"></td>
          <td class="cell-num" style="color:var(--s-success)">${totDone}</td><td class="cell-num"></td>
          <td class="cell-num">${totAll?Math.round(totDone/totAll*100):0}%</td>
        </tr></tfoot>
      </table></div>`;
  }

  mount(`${reportToolbar("Báo cáo tuyển dụng theo tháng","BC-01")}${reportFilter(["dept"])}
    <div id="rptBody">${build(candidates)}</div>`);
  document.querySelector(".rpt-apply").addEventListener("click",()=>{
    const from = document.querySelector(".rpt-from").value;
    const to = document.querySelector(".rpt-to").value;
    const dept = document.querySelector(".rpt-dept").value;
    const list = candidates.filter(c=>
      (!from||c.receivedDate>=from) && (!to||c.receivedDate<=to) && (!dept||c.dept===dept));
    document.getElementById("rptBody").innerHTML = build(list);
  });
}

/* --- Report 2: Theo phòng ban --- */
function renderReportDept(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Báo cáo"},{label:"Theo phòng ban"}]);

  function build(list){
    const byDept = {};
    list.forEach(c=>{
      if(!byDept[c.dept]) byDept[c.dept]={total:0,inProgress:0,done:0,rejected:0,positions:new Set()};
      byDept[c.dept].total++;
      byDept[c.dept].positions.add(c.position);
      if(c.status==="done") byDept[c.dept].done++;
      else if(c.status==="rejected") byDept[c.dept].rejected++;
      else byDept[c.dept].inProgress++;
    });
    if(!Object.keys(byDept).length) return `<div class="empty-state">Không có dữ liệu phù hợp.</div>`;
    const totals = Object.values(byDept);
    const sumTotal = totals.reduce((s,v)=>s+v.total,0);
    const sumDone  = totals.reduce((s,v)=>s+v.done,0);
    return `
      <div class="list-card"><table class="o-table">
        <thead><tr>
          <th>Phòng ban</th><th>Vị trí tuyển dụng</th><th class="cell-num">Tổng CV</th>
          <th class="cell-num">Đang xử lý</th><th class="cell-num">Hoàn thành</th><th class="cell-num">Không phù hợp</th><th class="cell-num">Tỷ lệ đạt</th>
        </tr></thead>
        <tbody>
          ${Object.entries(byDept).map(([d,v])=>{
            const rate = v.total ? Math.round(v.done/v.total*100) : 0;
            return `<tr><td class="cell-strong">${d}</td><td style="font-size:12px;color:var(--o-text-soft)">${[...v.positions].join(", ")}</td>
              <td class="cell-num">${v.total}</td><td class="cell-num">${v.inProgress}</td>
              <td class="cell-num" style="color:var(--s-success)">${v.done}</td><td class="cell-num" style="color:var(--s-danger)">${v.rejected}</td>
              <td class="cell-num"><span class="badge ${rate>=60?"badge-success":rate>=30?"badge-progress":"badge-draft"}">${rate}%</span></td></tr>`;
          }).join("")}
        </tbody>
        <tfoot><tr style="font-weight:700;background:#fafafa;">
          <td colspan="2">Tổng</td><td class="cell-num">${sumTotal}</td><td class="cell-num"></td>
          <td class="cell-num" style="color:var(--s-success)">${sumDone}</td><td class="cell-num"></td>
          <td class="cell-num">${sumTotal?Math.round(sumDone/sumTotal*100):0}%</td>
        </tr></tfoot>
      </table></div>`;
  }

  mount(`${reportToolbar("Báo cáo tuyển dụng theo phòng ban","BC-02")}${reportFilter(["status"])}
    <div id="rptBody">${build(candidates)}</div>`);
  document.querySelector(".rpt-apply").addEventListener("click",()=>{
    const from = document.querySelector(".rpt-from").value;
    const to = document.querySelector(".rpt-to").value;
    const status = document.querySelector(".rpt-status").value;
    const list = candidates.filter(c=>
      (!from||c.receivedDate>=from) && (!to||c.receivedDate<=to) && (!status||c.status===status));
    document.getElementById("rptBody").innerHTML = build(list);
  });
}

/* --- Report 3: Theo nguồn ứng viên --- */
function renderReportSource(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Báo cáo"},{label:"Theo nguồn ứng viên"}]);

  function build(list){
    const bySrc = {};
    list.forEach(c=>{
      if(!bySrc[c.source]) bySrc[c.source]={total:0,done:0,rejected:0,inProgress:0};
      bySrc[c.source].total++;
      if(c.status==="done") bySrc[c.source].done++;
      else if(c.status==="rejected") bySrc[c.source].rejected++;
      else bySrc[c.source].inProgress++;
    });
    if(!Object.keys(bySrc).length) return `<div class="empty-state">Không có dữ liệu phù hợp.</div>`;
    const sorted = Object.entries(bySrc).sort((a,b)=>b[1].total-a[1].total);
    const sumTotal = sorted.reduce((s,[,v])=>s+v.total,0);
    const sumDone  = sorted.reduce((s,[,v])=>s+v.done,0);
    return `
      <div class="list-card"><table class="o-table">
        <thead><tr>
          <th>Nguồn ứng viên</th><th class="cell-num">Tổng CV</th><th class="cell-num">Đang xử lý</th>
          <th class="cell-num">Hoàn thành</th><th class="cell-num">Không phù hợp</th>
          <th class="cell-num">Tỷ lệ đạt</th><th class="cell-num">% Tổng CV</th>
        </tr></thead>
        <tbody>
          ${sorted.map(([s,v])=>{
            const rate = v.total ? Math.round(v.done/v.total*100) : 0;
            const share = sumTotal ? Math.round(v.total/sumTotal*100) : 0;
            return `<tr><td class="cell-strong">${s}</td><td class="cell-num">${v.total}</td><td class="cell-num">${v.inProgress}</td>
              <td class="cell-num" style="color:var(--s-success)">${v.done}</td><td class="cell-num" style="color:var(--s-danger)">${v.rejected}</td>
              <td class="cell-num"><span class="badge ${rate>=60?"badge-success":rate>=30?"badge-progress":"badge-draft"}">${rate}%</span></td>
              <td class="cell-num">${share}%</td></tr>`;
          }).join("")}
        </tbody>
        <tfoot><tr style="font-weight:700;background:#fafafa;">
          <td>Tổng</td><td class="cell-num">${sumTotal}</td><td class="cell-num"></td>
          <td class="cell-num" style="color:var(--s-success)">${sumDone}</td><td class="cell-num"></td>
          <td class="cell-num">${sumTotal?Math.round(sumDone/sumTotal*100):0}%</td><td class="cell-num">100%</td>
        </tr></tfoot>
      </table></div>`;
  }

  mount(`${reportToolbar("Báo cáo theo nguồn ứng viên","BC-03")}${reportFilter(["dept"])}
    <div id="rptBody">${build(candidates)}</div>`);
  document.querySelector(".rpt-apply").addEventListener("click",()=>{
    const from = document.querySelector(".rpt-from").value;
    const to = document.querySelector(".rpt-to").value;
    const dept = document.querySelector(".rpt-dept").value;
    const list = candidates.filter(c=>
      (!from||c.receivedDate>=from) && (!to||c.receivedDate<=to) && (!dept||c.dept===dept));
    document.getElementById("rptBody").innerHTML = build(list);
  });
}

/* --- Report 4: Phễu tuyển dụng --- */
function renderReportFunnel(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Báo cáo"},{label:"Phễu tuyển dụng"}]);

  function build(list){
    const total = list.length || 1;
    const stages = [
      {label:"Tiếp nhận CV",   count: list.length, key:"all"},
      {label:"Process hồ sơ",  count: list.filter(c=>["processing","interview1","interview2","interview3","done","rejected"].includes(c.status)).length},
      {label:"PV vòng 1",      count: list.filter(c=>["interview1","interview2","interview3","done","rejected"].includes(c.status)).length},
      {label:"PV vòng 2",      count: list.filter(c=>["interview2","interview3","done"].includes(c.status)).length},
      {label:"PV vòng 3",      count: list.filter(c=>["interview3","done"].includes(c.status)).length},
      {label:"Hoàn thành",    count: list.filter(c=>c.status==="done").length},
    ];
    const rejected = list.filter(c=>c.status==="rejected").length;
    if(!list.length) return `<div class="empty-state">Không có dữ liệu phù hợp.</div>`;
    const bar = (v,mx)=>{
      const pct = mx ? (v/mx*100).toFixed(0) : 0;
      return `<div class="bar-track" style="height:20px;margin-right:0"><div class="bar-fill" style="width:${pct}%;height:100%"></div></div>`;
    };
    return `
      <div class="list-card"><table class="o-table">
        <thead><tr>
          <th style="width:30px;">#</th><th>Giai đoạn</th><th style="min-width:200px;">Tỷ lệ</th>
          <th class="cell-num">Số lượng</th><th class="cell-num">Tỷ lệ từ bước trước</th><th class="cell-num">Tỷ lệ từ đầu phễu</th>
        </tr></thead>
        <tbody>
          ${stages.map((s,i)=>{
            const prev = i===0 ? s.count : stages[i-1].count || 1;
            const convPrev = i===0 ? 100 : Math.round(s.count/prev*100);
            const convTotal = Math.round(s.count/total*100);
            return `<tr>
              <td style="color:var(--o-text-muted)">${i+1}</td>
              <td class="cell-strong">${s.label}</td>
              <td>${bar(s.count, stages[0].count)}</td>
              <td class="cell-num">${s.count}</td>
              <td class="cell-num"><span class="badge ${convPrev>=80?"badge-success":convPrev>=50?"badge-progress":"badge-danger"}">${convPrev}%</span></td>
              <td class="cell-num">${convTotal}%</td>
            </tr>`;
          }).join("")}
          <tr style="background:#fbe7e7">
            <td style="color:var(--s-danger)">✕</td>
            <td style="color:var(--s-danger);font-weight:600;">Không phù hợp (loại)</td>
            <td>${bar(rejected, stages[0].count)}</td>
            <td class="cell-num" style="color:var(--s-danger)">${rejected}</td>
            <td class="cell-num">—</td>
            <td class="cell-num">${Math.round(rejected/total*100)}%</td>
          </tr>
        </tbody>
      </table></div>`;
  }

  mount(`${reportToolbar("Phễu tuyển dụng (Recruitment Funnel)","BC-04")}${reportFilter(["dept","source"])}
    <div id="rptBody">${build(candidates)}</div>`);
  document.querySelector(".rpt-apply").addEventListener("click",()=>{
    const from = document.querySelector(".rpt-from").value;
    const to = document.querySelector(".rpt-to").value;
    const dept = document.querySelector(".rpt-dept")?.value||"";
    const src  = document.querySelector(".rpt-source")?.value||"";
    const list = candidates.filter(c=>
      (!from||c.receivedDate>=from) && (!to||c.receivedDate<=to)
      && (!dept||c.dept===dept) && (!src||c.source===src));
    document.getElementById("rptBody").innerHTML = build(list);
  });
}

/* --- Report 5: Định biên --- */
function renderReportHeadcount(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Báo cáo"},{label:"Báo cáo định biên"}]);

  const totalQuota = headcount.reduce((s,h)=>s+h.quota,0);
  const totalCurrent = headcount.reduce((s,h)=>s+h.current,0);
  const totalRecruiting = headcount.reduce((s,h)=>s+h.recruiting,0);
  const overRows = headcount.filter(h=>h.color==="red").length;

  mount(`
    ${reportToolbar("Báo cáo định biên tuyển dụng","BC-05")}

    <div class="kpi-grid" style="margin-bottom:18px;">
      <div class="kpi-card"><div class="kpi-val">${totalQuota}</div><div class="kpi-label">Tổng định biên</div></div>
      <div class="kpi-card c-info"><div class="kpi-val">${totalCurrent}</div><div class="kpi-label">Nhân sự hiện có</div></div>
      <div class="kpi-card c-progress"><div class="kpi-val">${totalRecruiting}</div><div class="kpi-label">Đang tuyển</div></div>
      <div class="kpi-card c-danger"><div class="kpi-val">${overRows}</div><div class="kpi-label">Vị trí vượt định biên</div></div>
    </div>

    <div class="list-card"><table class="o-table">
      <thead><tr>
        <th>Phòng ban</th><th>Vị trí</th>
        <th class="cell-num">Định biên</th><th class="cell-num">Hiện có</th>
        <th class="cell-num">Đã duyệt tuyển</th><th class="cell-num">Đang tuyển</th>
        <th class="cell-num">Đã tuyển</th><th class="cell-num">Còn thiếu</th><th>Trạng thái</th>
      </tr></thead>
      <tbody>
        ${headcount.map(h=>`
          <tr style="${h.color==="red"?"background:#fff8f8":""}">
            <td>${h.dept}</td><td class="cell-strong">${h.position}</td>
            <td class="cell-num">${h.quota}</td><td class="cell-num">${h.current}</td>
            <td class="cell-num">${h.approved}</td><td class="cell-num">${h.recruiting}</td>
            <td class="cell-num">${h.recruited}</td>
            <td class="cell-num" style="${h.shortage<0?"color:var(--s-danger);font-weight:700":"h.shortage===0?'color:var(--s-progress)':''"}">
              ${h.shortage}
            </td>
            <td>${headcountDot(h.color)}</td>
          </tr>`).join("")}
      </tbody>
      <tfoot><tr style="font-weight:700;background:#fafafa;">
        <td colspan="2">Tổng</td>
        <td class="cell-num">${totalQuota}</td>
        <td class="cell-num">${totalCurrent}</td>
        <td class="cell-num" colspan="3"></td>
        <td class="cell-num">${headcount.reduce((s,h)=>s+h.shortage,0)}</td>
        <td></td>
      </tr></tfoot>
    </table></div>
  `);
}

function renderReports(){
  setBreadcrumb([{label:"Tuyển dụng"},{label:"Báo cáo"}]);

  const total = candidates.length || 1;
  const done = candidates.filter(c=>c.status==="done").length;
  const rejected = candidates.filter(c=>c.status==="rejected").length;
  const passRate = Math.round(done/total*100);

  const funnel = [
    {label:"CV tiếp nhận",  val: candidates.length},
    {label:"Process hồ sơ", val: candidates.filter(c=>["processing","interview1","interview2","interview3","done","rejected"].includes(c.status)).length},
    {label:"PV vòng 1",     val: candidates.filter(c=>["interview1","interview2","interview3","done","rejected"].includes(c.status)).length},
    {label:"PV vòng 2",     val: candidates.filter(c=>["interview2","interview3","done"].includes(c.status)).length},
    {label:"PV vòng 3",     val: candidates.filter(c=>["interview3","done"].includes(c.status)).length},
    {label:"Hoàn thành",   val: done}
  ];
  const funnelMax = funnel[0].val || 1;

  const byDept = {};
  DEPARTMENTS.forEach(d=>{
    const dc = candidates.filter(c=>c.dept===d);
    if(!dc.length) return;
    byDept[d] = {
      total: dc.length,
      inProgress: dc.filter(c=>!["done","rejected"].includes(c.status)).length,
      done: dc.filter(c=>c.status==="done").length,
      rejected: dc.filter(c=>c.status==="rejected").length,
      rate: dc.length ? Math.round(dc.filter(c=>c.status==="done").length/dc.length*100) : 0
    };
  });

  const byMonth = {};
  candidates.forEach(c=>{const m=c.receivedDate.slice(0,7); byMonth[m]=(byMonth[m]||0)+1;});
  const monthMax = Math.max(...Object.values(byMonth), 1);

  mount(`
    <div class="view-toolbar">
      <div class="title-block">
        <h1>Báo cáo tuyển dụng <span class="screen-tag">BÁO CÁO</span></h1>
        <div class="subtitle">Phân tích hiệu quả tuyển dụng theo phòng ban, nguồn ứng viên, và thời gian</div>
      </div>
      <div class="btn-row">
        <button class="btn" id="btnExportRpt">⭳ Xuất báo cáo</button>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:18px;">
      <div class="kpi-card"><div class="kpi-val">${total}</div><div class="kpi-label">Tổng CV tiếp nhận</div></div>
      <div class="kpi-card c-success"><div class="kpi-val">${done}</div><div class="kpi-label">Hoàn thành tuyển dụng</div></div>
      <div class="kpi-card c-danger"><div class="kpi-val">${rejected}</div><div class="kpi-label">Không phù hợp</div></div>
      <div class="kpi-card c-progress"><div class="kpi-val">${total-done-rejected}</div><div class="kpi-label">Đang xử lý</div></div>
      <div class="kpi-card c-info"><div class="kpi-val">${passRate}%</div><div class="kpi-label">Tỷ lệ tuyển thành công</div></div>
      <div class="kpi-card"><div class="kpi-val">${jobPostings.filter(j=>j.status==="open").length}</div><div class="kpi-label">Tin tuyển dụng đang mở</div></div>
    </div>

    <div class="chart-grid">
      <div class="chart-card">
        <h3>Phễu tuyển dụng (Recruitment Funnel) ${info("Minh họa tỷ lệ chuyển đổi ứng viên qua từng bước quy trình. Khoảng hao hụt giữa các bước = ứng viên bị loại/dừng lại ở bước đó.")}</h3>
        ${funnel.map(f=>`
          <div class="bar-row">
            <div class="bar-label">${f.label}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${(f.val/funnelMax*100).toFixed(0)}%;background:${f.label==="Hoàn thành"?"var(--s-success)":"var(--o-primary)"}"></div></div>
            <div class="bar-val">${f.val}</div>
          </div>`).join("")}
        <div style="font-size:11.5px;color:var(--o-text-muted);margin-top:8px;">
          Tỷ lệ chuyển đổi toàn phễu: ${passRate}%
        </div>
      </div>

      <div class="chart-card">
        <h3>Tỷ lệ thành công theo phòng ban</h3>
        <table class="o-table" style="min-width:auto;">
          <thead><tr><th>Phòng ban</th><th class="cell-num">Tổng</th><th class="cell-num">Đang XL</th><th class="cell-num">Hoàn thành</th><th class="cell-num">Không đạt</th><th class="cell-num">Tỷ lệ</th></tr></thead>
          <tbody>
            ${Object.entries(byDept).map(([d,v])=>`
              <tr>
                <td class="cell-strong">${d}</td>
                <td class="cell-num">${v.total}</td>
                <td class="cell-num">${v.inProgress}</td>
                <td class="cell-num" style="color:var(--s-success)">${v.done}</td>
                <td class="cell-num" style="color:var(--s-danger)">${v.rejected}</td>
                <td class="cell-num"><span class="badge ${v.rate>=70?"badge-success":v.rate>=40?"badge-progress":"badge-draft"}">${v.rate}%</span></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>

      <div class="chart-card">
        <h3>Ứng viên theo tháng tiếp nhận</h3>
        ${Object.entries(byMonth).map(([m,v])=>`
          <div class="bar-row">
            <div class="bar-label">${m}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${(v/monthMax*100).toFixed(0)}%"></div></div>
            <div class="bar-val">${v}</div>
          </div>`).join("")}
      </div>

      <div class="chart-card">
        <h3>Ứng viên theo nguồn ${info("Dùng để đánh giá ROI từng kênh tuyển dụng — kênh nào mang lại nhiều ứng viên nhất / tỷ lệ đạt cao nhất.")}</h3>
        ${(()=>{
          const srcMap = countBy(candidates, c=>c.source);
          const srcMax = Math.max(...Object.values(srcMap), 1);
          return Object.entries(srcMap).map(([s,v])=>`
            <div class="bar-row">
              <div class="bar-label">${s}</div>
              <div class="bar-track"><div class="bar-fill" style="width:${(v/srcMax*100).toFixed(0)}%;background:var(--o-accent)"></div></div>
              <div class="bar-val">${v}</div>
            </div>`).join("");
        })()}
      </div>
    </div>
  `);

  document.getElementById("btnExportRpt").addEventListener("click",()=>toast("Demo: xuất báo cáo tuyển dụng ra Excel / PDF."));
}

/* ---------------- BOOTSTRAP ---------------- */

document.querySelectorAll(".nav-item[data-route]").forEach(item=>{
  item.addEventListener("click",(e)=>{ e.preventDefault(); navigate(item.dataset.route); });
});
document.querySelectorAll(".nav-dd-item[data-route]").forEach(item=>{
  item.addEventListener("click",(e)=>{ e.preventDefault(); navigate(item.dataset.route); });
});

function positionDropdown(triggerEl, menuEl){
  const r = triggerEl.getBoundingClientRect();
  menuEl.style.left = r.left + "px";
  menuEl.style.top  = r.bottom + "px";
  menuEl.style.minWidth = Math.max(r.width, 210) + "px";
}

const ddConfig = document.getElementById("ddConfig");
const ddConfigMenu = document.getElementById("ddConfigMenu");
ddConfig.addEventListener("click",(e)=>{
  e.stopPropagation();
  const opening = !ddConfigMenu.classList.contains("show");
  ddConfigMenu.classList.remove("show");
  ddReportsMenu.classList.remove("show");
  if(opening){ positionDropdown(ddConfig, ddConfigMenu); ddConfigMenu.classList.add("show"); }
});

const ddReportsBtn = document.getElementById("ddReports");
const ddReportsMenu = document.getElementById("ddReportsMenu");
ddReportsBtn.addEventListener("click",(e)=>{
  e.stopPropagation();
  const opening = !ddReportsMenu.classList.contains("show");
  ddReportsMenu.classList.remove("show");
  ddConfigMenu.classList.remove("show");
  if(opening){ positionDropdown(ddReportsBtn, ddReportsMenu); ddReportsMenu.classList.add("show"); }
});

document.addEventListener("click",()=>{ ddConfigMenu.classList.remove("show"); ddReportsMenu.classList.remove("show"); });

document.getElementById("btnOverview").addEventListener("click", openOverviewModal);
document.getElementById("btnAppGrid").addEventListener("click", ()=>toast("Demo: App Switcher — hiện đang ở module Tuyển dụng."));
document.getElementById("btnNotif").addEventListener("click", ()=>toast("Demo: 3 thông báo mới — lịch phỏng vấn, kết quả PV, cảnh báo định biên."));

router();
openOverviewModal();

function donutSvg(segments){
  const total = segments.reduce((s,x)=>s+x.v,0) || 1;
  const r = 40, cx=50, cy=50;
  let acc = 0;
  const circumference = 2*Math.PI*r;
  const circles = segments.map(seg=>{
    const frac = seg.v/total;
    const dash = frac*circumference;
    const gap = circumference - dash;
    const offset = -acc*circumference;
    acc += frac;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="14" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
  }).join("");
  return `<svg width="110" height="110" viewBox="0 0 100 100">${circles}</svg>`;
}
