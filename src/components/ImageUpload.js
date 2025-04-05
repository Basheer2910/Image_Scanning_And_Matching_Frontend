import { useState } from "react";

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-6">
                <h2 className="text-3xl font-bold text-center text-blue-700">Answer Sheet Evaluator</h2>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Student Answer Sheet (PDF/Image):</label>
                    <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={(e) => handleFileChange(e, setStudentFile)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                    {studentFile && (
                        <p className="mt-1 text-sm text-gray-600">📄 {studentFile.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Answer Key (PDF/Image):</label>
                    <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={(e) => handleFileChange(e, setAnswerKeyFile)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                    {answerKeyFile && (
                        <p className="mt-1 text-sm text-gray-600">📄 {answerKeyFile.name}</p>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-3 text-white font-bold rounded-lg transition ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Processing..." : "Submit"}
                </button>

                {loading && (
                    <div className="text-center text-sm text-gray-600">
                        ⏳ Processing... Elapsed: {timer} sec
                    </div>
                )}
                {console.log(response, " response fron backend")}
                {response && (
                    <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50 text-gray-800">
                        {response.data ? (
                            <>
                                <p className="font-semibold text-lg mb-1">✅ Score: {(Number(response.data.score)).toFixed(3)}</p>
                                <details className="mt-2">
                                    <summary className="cursor-pointer text-blue-700 underline">Show extracted answers</summary>
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
