import { useState, useEffect } from "react";

function ImageUpload() {
    const [studentImage, setStudentImage] = useState(null);
    const [answerKeyImage, setAnswerKeyImage] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    const handleFileChange = (event, setImage) => {
        const file = event.target.files[0];
        if (file) {
            console.log(file);
            setImage(file);
        }
    };

    const handleSubmit = async () => {
        if (!studentImage || !answerKeyImage) {
            alert("Please upload both images.");
            return;
        }

        setLoading(true);
        setResponse(null);
        setTimer(0);

        const countdown = setInterval(() => {
            setTimer((prev) => {
                return prev + 1;
            });
        }, 1000);

        const formData = new FormData();
        formData.append("student_image", studentImage);
        formData.append("answer_key", answerKeyImage);

        try {
            const res = await fetch("http://localhost:5000/process-images", {
                method: "POST",
                body: formData,
            });
            console.log("🚀 ~ handleSubmit ~ res:", res)

            const data = await res.json();
            clearInterval(countdown);
            setResponse(data);
        } catch (error) {
            clearInterval(countdown);
            setResponse({ error: "Error processing images" });
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Upload Images</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Student Answer Sheet:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setStudentImage)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Answer Key:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setAnswerKeyImage)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                >
                    Submit
                </button>

                {loading && (
                    <p className="text-center text-gray-600 mt-4">
                        ⏳ Processing in {timer} / 30 sec
                    </p>
                )}

                {response && (
                    <div className="mt-6 p-4 bg-gray-100 rounded">
                        <h3 className="text-lg font-semibold mb-2">Response:</h3>
                        <pre className="text-sm text-gray-700">{JSON.stringify(response, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageUpload;
