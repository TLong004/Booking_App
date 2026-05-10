import 'package:flutter/material.dart';
import 'package:myapp/models/appointment.dart';

class CancelSheet extends StatefulWidget {
  final AppointmentModel appointment;
  final void Function(String reason) onConfirm;

  const CancelSheet({required this.appointment, required this.onConfirm});

  @override
  State<CancelSheet> createState() => _CancelSheetState();
}

class _CancelSheetState extends State<CancelSheet> {
  final _reasonCtrl = TextEditingController();
  String? _selected;

  static const _quickReasons = [
    "Bận việc đột xuất",
    "Muốn đổi lịch khác",
    "Đã khỏe hơn, không cần khám",
    "Lý do cá nhân khác",
  ];

  @override
  void dispose() {
    _reasonCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    final reason = _selected == "Lý do khác"
        ? _reasonCtrl.text.trim()
        : (_selected ?? _reasonCtrl.text.trim());

    if (reason.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Vui lòng chọn hoặc nhập lý do hủy")),
      );
      return;
    }

    Navigator.pop(context);
    widget.onConfirm(reason);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 20, right: 20, top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
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
          const Text("Hủy lịch hẹn",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text("Lịch với ${widget.appointment.doctor.fullName} ngày ${widget.appointment.appointmentDate}",
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
          const SizedBox(height: 16),
          const Text("Lý do hủy",
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
          const SizedBox(height: 10),
          ..._quickReasons.map((r) => GestureDetector(
                onTap: () => setState(() => _selected = r),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: _selected == r
                        ? const Color(0xFF00B4D8).withValues(alpha: 0.08)
                        : Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: _selected == r
                          ? const Color(0xFF00B4D8)
                          : Colors.grey.shade200,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _selected == r
                            ? Icons.radio_button_checked
                            : Icons.radio_button_off,
                        size: 18,
                        color: _selected == r
                            ? const Color(0xFF00B4D8)
                            : Colors.grey,
                      ),
                      const SizedBox(width: 10),
                      Text(r, style: const TextStyle(fontSize: 14)),
                    ],
                  ),
                ),
              )),
          const SizedBox(height: 8),
          TextField(
            controller: _reasonCtrl,
            maxLines: 2,
            onTap: () => setState(() => _selected = null),
            decoration: InputDecoration(
              hintText: "Hoặc nhập lý do khác...",
              hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
              filled: true,
              fillColor: Colors.grey.shade50,
              contentPadding: const EdgeInsets.all(14),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: Colors.grey.shade300),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: Colors.grey.shade300),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFF00B4D8), width: 1.5),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text("Không hủy"),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text("Xác nhận hủy",
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}