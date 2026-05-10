import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/logic/patient/patient_bloc.dart';
import 'package:myapp/models/patient.dart';

class EditPatientSheet extends StatefulWidget {
  final PatientModel patient;
  const EditPatientSheet({required this.patient});

  @override
  State<EditPatientSheet> createState() => _EditPatientSheetState();
}

class _EditPatientSheetState extends State<EditPatientSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameCtrl;
  late final TextEditingController _phoneCtrl;
  late final TextEditingController _cccdCtrl;
  late final TextEditingController _addressCtrl;
  late String _gender;
  DateTime? _dob;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.patient.fullName);
    _phoneCtrl = TextEditingController(text: widget.patient.phoneNumber);
    _cccdCtrl = TextEditingController(text: widget.patient.cccd);
    _addressCtrl = TextEditingController(text: widget.patient.address);
    _gender = widget.patient.gender.isNotEmpty ? widget.patient.gender : 'Nam';
    if (widget.patient.dob.isNotEmpty) {
      try {
        _dob = DateTime.parse(widget.patient.dob);
      } catch (_) {}
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _cccdCtrl.dispose();
    _addressCtrl.dispose();
    super.dispose();
  }

  String _formatDate(DateTime d) =>
      "${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}";

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    final data = {
      'fullName': _nameCtrl.text.trim(),
      'gender': _gender,
      'dob': _dob != null ? _formatDate(_dob!) : null,
      'phoneNumber': _phoneCtrl.text.trim(),
      'cccd': _cccdCtrl.text.trim(),
      'address': _addressCtrl.text.trim(),
    };
    context.read<PatientBloc>().add(UpdatePatient(widget.patient.id!, data));
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 20, right: 20, top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40, height: 4,
                  decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 16),
              const Text("Chỉnh sửa hồ sơ",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 20),

              _label("Họ và tên *"),
              TextFormField(
                controller: _nameCtrl,
                decoration: _inputDeco("Nhập họ và tên"),
                validator: (v) => v == null || v.trim().isEmpty ? "Vui lòng nhập họ và tên" : null,
              ),
              const SizedBox(height: 14),

              _label("Giới tính"),
              Row(
                children: ['Nam', 'Nữ', 'Khác'].map((g) => Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () => setState(() => _gender = g),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: _gender == g ? const Color(0xFF00B4D8) : Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: _gender == g ? const Color(0xFF00B4D8) : Colors.grey.shade300,
                          ),
                        ),
                        child: Text(g,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: _gender == g ? Colors.white : Colors.black87,
                              fontWeight: FontWeight.w600,
                            )),
                      ),
                    ),
                  ),
                )).toList(),
              ),
              const SizedBox(height: 14),

              _label("Ngày sinh"),
              GestureDetector(
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: _dob ?? DateTime(1990),
                    firstDate: DateTime(1900),
                    lastDate: DateTime.now(),
                  );
                  if (picked != null) setState(() => _dob = picked);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today_outlined, size: 18, color: Colors.grey),
                      const SizedBox(width: 10),
                      Text(
                        _dob != null ? _formatDate(_dob!) : "Chọn ngày sinh",
                        style: TextStyle(
                          color: _dob != null ? Colors.black87 : Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),

              _label("Số điện thoại"),
              TextFormField(
                controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: _inputDeco("Nhập số điện thoại"),
              ),
              const SizedBox(height: 14),

              _label("Số CCCD"),
              TextFormField(
                controller: _cccdCtrl,
                keyboardType: TextInputType.number,
                decoration: _inputDeco("Nhập số CCCD"),
              ),
              const SizedBox(height: 14),

              _label("Địa chỉ"),
              TextFormField(
                controller: _addressCtrl,
                decoration: _inputDeco("Nhập địa chỉ"),
              ),
              const SizedBox(height: 24),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF00B4D8),
                    minimumSize: const Size(double.infinity, 52),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text("LƯU THAY ĐỔI",
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _label(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(text, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
      );

  InputDecoration _inputDeco(String hint) => InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
        filled: true,
        fillColor: Colors.grey.shade50,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey.shade300)),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey.shade300)),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF00B4D8), width: 1.5)),
      );
}