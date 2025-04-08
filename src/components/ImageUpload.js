import { useState } from "react";
import { FaFileAlt, FaKey, FaCloudUploadAlt } from "react-icons/fa";

function ImageUpload() {
    const [studentFile, setStudentFile] = useState(null);
    const [answerKeyFile, setAnswerKeyFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    const handleFileChange = (event, setFile) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!studentFile || !answerKeyFile) {
            alert("Please upload both files.");
            return;
        }

        setLoading(true);
        setResponse(null);
        setTimer(0);

        const countdown = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);

        const formData = new FormData();
        formData.append("student_image", studentFile);
        formData.append("answer_key", answerKeyFile);

        try {
            const res = await fetch("http://localhost:5000/process-images", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            clearInterval(countdown);
            setResponse(data);
        } catch (error) {
            clearInterval(countdown);
            setResponse({ error: "Error processing files" });
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-xl space-y-6 border border-yellow-400/20">
                <h2 className="text-3xl font-bold text-center text-yellow-400 glow-text">Answer Sheet Processor</h2>

                {/* Answer Sheet Upload */}
                <div className="upload-box rounded-xl p-6 text-center border-2 border-dashed border-yellow-400/30 hover:border-yellow-400/60 transition">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-yellow-400 text-3xl">
                            <FaFileAlt />
                        </div>
                        <h3 className="text-xl font-semibold text-yellow-400">Upload Answer Sheet</h3>
                        <p className="text-sm text-gray-400">Upload scanned PDF or image of student answer sheet</p>

                        <label className="file-label mt-4 inline-flex items-center gap-2 px-4 py-2 border border-yellow-400 text-yellow-400 rounded-md bg-black hover:bg-yellow-400/10 transition cursor-pointer">
                            <FaCloudUploadAlt />
                            <span>Choose File</span>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.pdf"
                                onChange={(e) => handleFileChange(e, setStudentFile)}
                                className="hidden"
                            />
                        </label>
                        {studentFile && (
                            <p className="mt-2 text-sm text-gray-500">{studentFile.name}</p>
                        )}
                    </div>
                </div>

                {/* Answer Key Upload */}
                <div className="upload-box rounded-xl p-6 text-center border-2 border-dashed border-yellow-400/30 hover:border-yellow-400/60 transition">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-yellow-400 text-3xl">
                            <FaKey />
                        </div>
                        <h3 className="text-xl font-semibold text-yellow-400">Upload Answer Key</h3>
                        <p className="text-sm text-gray-400">Upload PDF, CSV, or Excel containing correct answers</p>

                        <label className="file-label mt-4 inline-flex items-center gap-2 px-4 py-2 border border-yellow-400 text-yellow-400 rounded-md bg-black hover:bg-yellow-400/10 transition cursor-pointer">
                            <FaCloudUploadAlt />
                            <span>Choose File</span>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.pdf"
                                onChange={(e) => handleFileChange(e, setAnswerKeyFile)}
                                className="hidden"
                            />
                        </label>
                        {answerKeyFile && (
                            <p className="mt-2 text-sm text-gray-500">{answerKeyFile.name}</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-3 font-bold text-black rounded-xl bg-yellow-400 transition hover:bg-yellow-300 shadow-md ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Processing..." : "Process Answers"}
                </button>

                {loading && (
                    <p className="text-center text-sm text-gray-400">⏳ Processing... Elapsed: {timer}s</p>
                )}

                {response && (
                    <div className="mt-4 p-4 border border-yellow-300/40 rounded-lg bg-yellow-100 text-black">
                        {response.data ? (
                            <>
                                <p className="font-semibold text-lg mb-1">✅ Score: {(Number(response.data.score)).toFixed(1)}</p>
                                <details className="mt-2">
                                    <summary className="cursor-pointer text-yellow-700 underline">Show extracted answers</summary>
                                    <div className="mt-2 text-sm">
                                        <p><strong>Student:</strong> {response.data.student_answer}</p>
                                        <p className="mt-2"><strong>Answer Key:</strong> {response.data.answer_key}</p>
                                    </div>
                                </details>
                            </>
                        ) : (
                            <p className="text-red-600">❌ {response.error || "Something went wrong."}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageUpload;
