import { useEffect, useState } from "react";

const ArtistResponses = () => {
    const [responses, setResponses] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/customizationResponse/artist/responses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch responses.");

                const data = await response.json();
                setResponses(data.responses);
                setStatistics(data.statistics);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, []);

    if (loading) return <div className="text-center py-8">Loading responses...</div>;
    if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 bg-[#FAF9F6]">
            

            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#F6EEEE] p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-[#E07385]">Pending</h3>
                        <p className="text-2xl font-bold">{statistics.pending}</p>
                    </div>
                    <div className="bg-[#F6EEEE] p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-[#E07385]">Accepted</h3>
                        <p className="text-2xl font-bold">{statistics.accepted}</p>
                    </div>
                    <div className="bg-[#F6EEEE] p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-[#E07385]">Declined</h3>
                        <p className="text-2xl font-bold">{statistics.declined}</p>
                    </div>
                </div>
            )}

            {responses.length === 0 ? (
                <p className="text-center text-gray-700 text-lg">No responses found.</p>
            ) : (
                <div className="space-y-6">
                    {responses.map((response) => (
                        <div key={response.responseId} className="bg-[#F6EEEE] p-6 rounded-lg shadow-md">
                            <div className="flex flex-col md:flex-row gap-6">
                                {response.customizationrequest.image && (
                                    <div className="md:w-1/4">
                                        <img
                                            src={response.customizationrequest.image}
                                            alt="Request"
                                            className="w-full h-40 object-cover rounded-lg shadow"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-semibold text-black">
                                                {response.customizationrequest.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                Request by: @{response.customizationrequest.customer.username}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            response.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            response.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {response.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-gray-500 font-medium">Your Price</p>
                                            <p className="text-lg font-semibold">💰 {response.price} LE</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium">Estimated Completion</p>
                                            <p className="text-lg font-semibold">
                                                {new Date(response.estimationCompletionTime).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium">Customer Budget</p>
                                            <p className="text-lg font-semibold">
                                                {response.customizationrequest.budget} LE
                                            </p>
                                        </div>
                                    </div>

                                    {response.notes && (
                                        <div className="mt-4">
                                            <p className="text-gray-500 font-medium">Your Notes</p>
                                            <p className="text-gray-800">{response.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArtistResponses;